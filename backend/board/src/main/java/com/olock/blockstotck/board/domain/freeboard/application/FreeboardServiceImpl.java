package com.olock.blockstotck.board.domain.freeboard.application;

import com.olock.blockstotck.board.domain.freeboard.dto.request.FreeboardPostRequest;
import com.olock.blockstotck.board.domain.freeboard.exception.validator.FreePostValidator;
import com.olock.blockstotck.board.domain.freeboard.persistence.FileRepository;
import com.olock.blockstotck.board.domain.freeboard.persistence.FreePostCommentRepository;
import com.olock.blockstotck.board.domain.freeboard.persistence.FreePostLikeRepository;
import com.olock.blockstotck.board.domain.freeboard.persistence.FreePostRepository;
import com.olock.blockstotck.board.domain.freeboard.persistence.entity.File;
import com.olock.blockstotck.board.domain.freeboard.persistence.entity.FreePost;
import com.olock.blockstotck.board.infra.awsS3.AwsS3Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FreeboardServiceImpl implements FreeboardService{

    private final FreePostRepository freePostRepository;
    private final FileRepository fileRepository;
    private final FreePostCommentRepository freePostCommentRepository;
    private final FreePostValidator freePostValidator;
    private final AwsS3Uploader awsS3Uploader;
    private final FreePostLikeRepository freePostLikeRepository;

    @Override
    public long postFreePost(long memberId, FreeboardPostRequest freeboardPostRequest) {

        FreePost freePost = new FreePost(memberId, freeboardPostRequest.getTitle(), freeboardPostRequest.getContent(), 0);
        FreePost postResponse = freePostRepository.save(freePost);

        return postResponse.getId();
    }

    @Override
    public void postFreeBoardFile(List<MultipartFile> multipartFileList, List<String> filePathList, long freePostId) {
        for(int i=0; i<multipartFileList.size(); i++){

            FreePost freePost = freePostRepository.findById(freePostId);

            String imgOriginalName = multipartFileList.get(i).getOriginalFilename();
            String imgPath = filePathList.get(i);
            String type = multipartFileList.get(i).getContentType();
            long size = multipartFileList.get(i).getSize();

            File file = new File(freePost, imgOriginalName, imgPath, type, size);

            fileRepository.save(file);
        }
    }

    @Override
    @Transactional
    public void deleteFreePost(Long memberId, Long freeboardId) {
        Optional<FreePost> tmpFreePost = freePostRepository.findById(freeboardId);
        freePostValidator.checkFreePostExist(tmpFreePost);
        FreePost freePost = tmpFreePost.get();
        freePostValidator.checkFreePostWriter(freePost, memberId);
        
        freePostCommentRepository.deleteAllByFreePostId(freeboardId);

        List<File> fileList = fileRepository.findAllByFreePostId(freeboardId);
        for(File file : fileList){
            String imgPath = file.getImgPath();
            String fileName = imgPath.split("/")[3]+"/"+imgPath.split("/")[4];

            awsS3Uploader.delete(fileName);
        }
        fileRepository.deleteAllByFreePostId(freeboardId);

        freePostLikeRepository.deleteAllByFreePostId(freeboardId);

        freePostRepository.delete(freePost);
    }

    @Override
    public void deleteAllFreePostComment(Long freeboardId) {

    }

    @Override
    public void deleteMyFreePostComment(Long memberId, Long commentId) {

    }
}
