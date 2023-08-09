import { createAction, props } from '@ngrx/store';
import { CommentsById, GalleryByCategory } from './gallery.reducers';
import { Comment } from '../../models/comment.model';

//Categories
export const FetchCategoriesStart = createAction(
    '[Galleries] Fetch Categories Start'
);
export const FetchCategoriesSuccess = createAction(
    '[Galleries] Fetch Categories Success',
    props<{
        categories: string[];
    }>()
);

export const FetchCategoriesFail = createAction(
    '[Galleries] Fetch Categories Fail'
);

//Category
export const FetchCategoryStart = createAction(
    '[Gallery] Fetch Category Start',
    props<{ category: string }>()
);

export const FetchCategorySuccess = createAction(
    '[Gallery] Fetch Category Success',
    props<GalleryByCategory>()
);

export const FetchCategoryFail = createAction('[Gallery] Fetch Category Fail');

//photo attributes list
export const FetchCommentsStart = createAction(
    '[Carousel] Fetch Comments Start',
    props<{ photoId: number }>()
);

export const FetchCommentsSuccess = createAction(
    '[Carousel] Fetch Comments Success',
    props<CommentsById>()
);

export const FetchCommentsFail = createAction(
    '[Carousel] Fetch Comments Fail',
    props<{ galleryStateError: { hasError: boolean; message: string } }>()
);

//increment viewsNr
export const IncrementViewsNrStart = createAction(
    '[Carousel] Increment Views Nr Start',
    props<{ photoId: number }>()
);

export const IncrementViewsNrSuccess = createAction(
    '[Carousel] Increment Views Nr Success',
    props<{ photoId: number; viewsNr: number }>()
);

export const IncrementViewsNrFail = createAction(
    '[Carousel] Increment Views Nr Fail'
);

//post comment
export const PostCommentStart = createAction(
    '[Carousel] Post Comment Start',
    props<{ newComment: Comment }>()
);

export const PostCommentSuccess = createAction(
    '[Carousel] Post Comment Success',
    props<{ newComment: Comment, newAverageRating: number }>()
);

export const PostCommentFail = createAction(
    '[Carousel] Post Comment Fail',
    props<{ hasError: boolean, message: string}>()
);
