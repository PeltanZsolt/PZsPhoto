import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as GalleryActions from './gallery.actions';
import {
    map,
    switchMap,
} from 'rxjs';
import { PhotoService } from '../../services/photo.service';
import { GalleryByCategory } from './gallery.reducers';
import { CommentService } from '../../services/comment.service';
import { ViewsService } from '../../services/views.services';
import { Comment } from '../../models/comment.model';

@Injectable()
export class GalleryEffects {
    constructor(
        private actions$: Actions,
        private photoService: PhotoService,
        private commentService: CommentService,
        private viewsService: ViewsService
    ) {}

    fetchCategoriesStart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GalleryActions.FetchCategoriesStart),
            switchMap(() => {
                return this.photoService.getCategoriesPartialList();
            }),
            map((response) => {
                if (response.error) {
                    return GalleryActions.FetchCategoriesFail;
                } else {
                    return GalleryActions.FetchCategoriesSuccess({
                        categories: response,
                    });
                }
            })
        )
    );

    fetchCategoryStart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GalleryActions.FetchCategoryStart),
            switchMap((action) => {
                return this.photoService.getPhotoListByCategory(
                    action.category
                );
            }),
            map((response: any) => {
                if (response.error) {
                    return GalleryActions.FetchCategoryFail;
                } else {
                    const galleryByCategory: GalleryByCategory = {
                        category: response[0].category,
                        photosByCategory: response,
                    };
                    return GalleryActions.FetchCategorySuccess(
                        galleryByCategory
                    );
                }
            })
        )
    );

    fetchCommentsStart$ = createEffect(() => {
        let photoId: number;
        return this.actions$.pipe(
            ofType(GalleryActions.FetchCommentsStart),
            switchMap((action) => {
                photoId = action.photoId;
                return this.commentService.getCommentsByPhotoId(action.photoId);
            }),
            map((response: any) => {
                if (response.error) {
                    return GalleryActions.FetchCommentsFail({
                        galleryStateError: {
                            hasError: true,
                            message: response.message,
                        },
                    });
                } else {
                    return GalleryActions.FetchCommentsSuccess({
                        photoId: photoId,
                        comments: response,
                    });
                }
            })
        );
    });

    incrementViewsNrStarrt$ = createEffect(() => {
        let photoId: number;
        return this.actions$.pipe(
            ofType(GalleryActions.IncrementViewsNrStart),
            switchMap((action) => {
                photoId = action.photoId;
                return this.viewsService.incrementViewsNr(action.photoId);
            }),
            map((res) => {
                if (res)
                    return GalleryActions.IncrementViewsNrSuccess({
                        photoId: photoId,
                        viewsNr: res.viewsNr,
                    });
                return GalleryActions.IncrementViewsNrFail;
            })
        );
    });

    postCommentStart$ = createEffect(() => {
        let newComment: Comment;
        return this.actions$.pipe(
            ofType(GalleryActions.PostCommentStart),
            switchMap((action) => {
                newComment = action.newComment;
                return this.commentService.postComment(newComment).pipe();
            }),
            map((res: any)=> {
                if (res.averageRating) {
                    return GalleryActions.PostCommentSuccess({newComment, newAverageRating: res.averageRating})
                }
                return GalleryActions.PostCommentFail({hasError: true, message: res.message})
            })
        );
    });
}
