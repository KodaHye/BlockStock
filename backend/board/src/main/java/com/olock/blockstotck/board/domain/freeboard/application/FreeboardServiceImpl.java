package com.olock.blockstotck.board.domain.freeboard.application;

import com.olock.blockstotck.board.domain.freeboard.dto.request.FreePostCommentRequest;
import com.olock.blockstotck.board.domain.freeboard.dto.request.FreePostLikeRequest;
import com.olock.blockstotck.board.domain.freeboard.dto.request.FreePostRequestParam;
import com.olock.blockstotck.board.domain.freeboard.dto.request.FreeboardPostRequest;
import com.olock.blockstotck.board.domain.freeboard.dto.response.*;
import com.olock.blockstotck.board.domain.freeboard.exception.validator.FreePostCommentValidator;
import com.olock.blockstotck.board.domain.freeboard.exception.validator.FreePostValidator;
import com.olock.blockstotck.board.domain.freeboard.persistence.*;
import com.olock.blockstotck.board.domain.freeboard.persistence.entity.File;
import com.olock.blockstotck.board.domain.freeboard.persistence.entity.FreePost;
import com.olock.blockstotck.board.domain.freeboard.persistence.entity.FreePostComment;
import com.olock.blockstotck.board.domain.freeboard.persistence.entity.FreePostLike;
import com.olock.blockstotck.board.domain.member.application.MemberServiceImpl;
import com.olock.blockstotck.board.domain.member.persistance.Member;
import com.olock.blockstotck.board.infra.awsS3.AwsS3Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FreeboardServiceImpl implements FreeboardService{

    private final FreePostRepository freePostRepository;
    private final FileRepository fileRepository;
    private final FreePostCommentRepository freePostCommentRepository;
    private final AwsS3Uploader awsS3Uploader;
    private final FreePostLikeRepository freePostLikeRepository;

    private final MemberServiceImpl memberService;

    private final FreePostValidator freePostValidator;
    private final FreePostCommentValidator freePostCommentValidator;

    @Override
    public long postFreePost(long memberId, FreeboardPostRequest freeboardPostRequest) {

        FreePost freePost = new FreePost(memberId, freeboardPostRequest.getTitle(), freeboardPostRequest.getContent(), 0);
        FreePost postResponse = freePostRepository.save(freePost);

        return postResponse.getId();
    }

    @Override
    public void postFreeBoardFile(List<MultipartFile> multipartFileList, List<String> filePathList, long freePostId) {

        for(int i=0; i<filePathList.size(); i++){

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
    public void postFreePostComment(Long memberId, FreePostCommentRequest freePostCommentRequest) {

        Optional<FreePost> tmpFreePost = freePostRepository.findById(freePostCommentRequest.getFreeBoardId());
        freePostValidator.checkFreePostExist(tmpFreePost);
        FreePost freePost = tmpFreePost.get();

        FreePostComment freePostComment = new FreePostComment(memberId, freePost, freePostCommentRequest.getContent());

        freePostCommentRepository.save(freePostComment);
    }

    @Override
    public void deleteFreePostComment(Long memberId, Long commentId) {

        Optional<FreePostComment> tmpFreePostComment = freePostCommentRepository.findById(commentId);
        freePostCommentValidator.checkFreePostCommentExist(tmpFreePostComment);

        FreePostComment freePostComment = tmpFreePostComment.get();
        freePostCommentValidator.checkFreePostCommentWriter(freePostComment, memberId);

        freePostCommentRepository.delete(freePostComment);
    }

    @Override
    public void likeFreePost(Long memberId, FreePostLikeRequest freePostLikeRequest) {

        Optional<FreePost> tmpFreePost = freePostRepository.findById(freePostLikeRequest.getFreePostId());
        freePostValidator.checkFreePostExist(tmpFreePost);

        Optional<FreePostLike> tmpFreePostLike = freePostLikeRepository.findByMemberIdAndFreePostId(memberId, freePostLikeRequest.getFreePostId());
        freePostValidator.checkAlreadyLike(tmpFreePostLike);

        FreePostLike freePostLike = new FreePostLike(memberId, tmpFreePost.get());

        freePostLikeRepository.save(freePostLike);
    }

    @Override
    public void unlikeFreePost(Long memberId, Long freePostId) {

        Optional<FreePost> tmpFreePost = freePostRepository.findById(freePostId);
        freePostValidator.checkFreePostExist(tmpFreePost);

        Optional<FreePostLike> tmpFreePostLike = freePostLikeRepository.findByMemberIdAndFreePostId(memberId, freePostId);
        freePostValidator.checkAlreadyUnlike(tmpFreePostLike);

        FreePostLike freePostLike = tmpFreePostLike.get();

        freePostLikeRepository.delete(freePostLike);
    }

    @Transactional
    @Override
    public FreePostResponse getFreePost(Long memberId, Long freePostId) {
        Optional<FreePost> tmpFreePost = freePostRepository.findById(freePostId);
        freePostValidator.checkFreePostExist(tmpFreePost);

        freePostRepository.updateHit(freePostId);

        FreePost freePost = tmpFreePost.get();

        long likeCnt = freePostLikeRepository.countByFreePostId(freePostId);

        Member member = memberService.getMember(freePost.getMemberId());
        String nickName = member.getNickname();

        boolean isLike = true;
        if(freePostLikeRepository.findByMemberIdAndFreePostId(memberId, freePostId).isEmpty()){
            isLike = false;
        }

        List<File> fileList = fileRepository.findAllByFreePostId(freePostId);
        List<FileResponse> fileResponseList = new ArrayList<>();
        for(File file : fileList){
            FileResponse fr = new FileResponse(file.getImgOriginalName(), file.getImgPath(), file.getType());
            fileResponseList.add(fr);
        }

        return new FreePostResponse(freePost, nickName, likeCnt, isLike, fileResponseList);
    }

    @Override
    public FreePostListCntResponse getFreePostList(Long memberId, FreePostRequestParam freePostRequestParam) {

        Pageable pageable = PageRequest.of(
                freePostRequestParam.getPage(),
                freePostRequestParam.getSize(),
                Sort.by(Sort.Direction.DESC, freePostRequestParam.getSort())
        );

        Specification<FreePost> spec = (root, query, criteriaBuilder) -> null;

        if(freePostRequestParam.getKeyword() != null){
            spec = spec.and(FreePostSpecification.findByKeyword(freePostRequestParam.getKeyword()));
        }
        if(freePostRequestParam.getMy()){
            spec = spec.and(FreePostSpecification.findByMy(memberId));
        }
        if(freePostRequestParam.getLike()){
            spec = spec.and(FreePostSpecification.findByLike(memberId));
        }

        long totalCnt = freePostRepository.count(spec);

        Page<FreePost> findFreePostList = freePostRepository.findAll(spec, pageable);

        List<FreePostListResponse> freePostListResponse = findFreePostList.stream()
                .map(findFreePost -> {
                    Member member = memberService.getMember(findFreePost.getMemberId());
                    return new FreePostListResponse(findFreePost, member.getId(), member.getNickname());
                }).collect(Collectors.toList());

        return new FreePostListCntResponse(freePostListResponse, totalCnt);
    }

    @Override
    public List<FreePostListResponse> getFreePostMy(Long memberId, Long userId, Integer page, Integer size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<FreePost> findFreePostList = freePostRepository.findByMemberId(userId, pageable);

        return findFreePostList.stream()
                .map(findFreePost -> {
                    Member member = memberService.getMember(findFreePost.getMemberId());
                    return new FreePostListResponse(findFreePost, member.getId(), member.getNickname());
                }).collect(Collectors.toList());
    }

    @Override
    public List<FreePostCommentResponse> getFreePostCommentList(Long freePostId) {

        Optional<FreePost> tmpFreePost = freePostRepository.findById(freePostId);
        freePostValidator.checkFreePostExist(tmpFreePost);

        List<FreePostComment> freePostCommentList = freePostCommentRepository.findAllByFreePostId(freePostId);

        return freePostCommentList.stream()
                .map(freePostComment -> {
                    Member member = memberService.getMember(freePostComment.getMemberId());
                    return new FreePostCommentResponse(freePostComment, member.getNickname());
                })
                .collect(Collectors.toList());
    }

}
