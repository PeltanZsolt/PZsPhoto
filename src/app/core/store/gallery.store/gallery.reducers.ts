import { createReducer, on } from '@ngrx/store';
import * as GalleryActions from './gallery.actions';
import { Photo } from '../../models/photo.model';
import { Comment } from '../../models/comment.model';

export interface GalleryByCategory {
    category: string;
    photosByCategory: Photo[];
}

export interface CommentsById {
    photoId: number;
    comments: Comment[];
}

export interface GalleryState {
    categories: string[];
    gallery: GalleryByCategory[];
    allCommentsById: CommentsById[];
    galleryStateError: {
        hasError: boolean;
        message?: string;
    };
}

const initialState: GalleryState = {
    categories: [],
    gallery: [],
    allCommentsById: [],
    galleryStateError: {
        hasError: false,
        message: '',
    },
};

export const GalleryReducer = createReducer(
    initialState,

    on(GalleryActions.FetchCategoriesSuccess, (state, action) => ({
        ...state,
        categories: action.categories,
    })),

    on(GalleryActions.FetchCategoriesFail, (state, action) => ({
        ...state,
        categories: [],
        galleryStateError: {
            hasError: true,
            message: '',
        },
    })),

    on(GalleryActions.FetchCategorySuccess, (state, action) => ({
        ...state,
        gallery: [
            ...state.gallery,
            {
                category: action.category,
                photosByCategory: action.photosByCategory,
            },
        ],
        galleryStateError: {
            hasError: false,
            message: '',
        },
    })),

    on(GalleryActions.FetchCategoryFail, (state, action) => ({
        ...state,
        categories: [],
        galleryErrorState: {
            hasError: true,
            message: 'Error: Fetching photos list by category failed',
        },
    })),

    on(GalleryActions.FetchCommentsSuccess, (state, action) => ({
        ...state,
        allCommentsById: [
            ...state.allCommentsById,
            { photoId: action.photoId, comments: action.comments },
        ],
    })),

    on(GalleryActions.FetchCommentsFail, (state, action) => ({
        ...state,
        galleryErrorState: {
            hasError: true,
            message: 'Error: Fetching comments failed.',
        },
    })),

    on(GalleryActions.IncrementViewsNrSuccess, (state, action) => {
        const updatedGallery = state.gallery.map(
            (galleryByCategory: GalleryByCategory) => {
                return {
                    category: galleryByCategory.category,
                    photosByCategory: galleryByCategory.photosByCategory.map(
                        (photo) => {
                            if (photo.id === action.photoId) {
                                return { ...photo, viewsNr: action.viewsNr };
                            }
                            return photo;
                        }
                    ),
                };
            }
        );
        return {
            ...state,
            gallery: updatedGallery,
        };
    }),

    on(GalleryActions.PostCommentSuccess, (state, action) => {
        let updatedAllComments: CommentsById[] = [];

        const existingCommentsById = state.allCommentsById.find(
            (commentsById) => commentsById.photoId === action.newComment.photoId
        );

        if (existingCommentsById) {
            updatedAllComments = state.allCommentsById.map(
                (commentsByPhotoId) => {
                    return {
                        ...commentsByPhotoId,
                        comments: [
                            ...commentsByPhotoId.comments,
                            action.newComment,
                        ],
                    };
                }
            );
        } else {
            const newCommentbyId: CommentsById = {
                photoId: action.newComment.photoId,
                comments: [action.newComment],
            };
            updatedAllComments = [newCommentbyId];
        }

        const updatedGallery = state.gallery.map(
            (galleryByCategory: GalleryByCategory) => {
                return {
                    category: galleryByCategory.category,
                    photosByCategory: galleryByCategory.photosByCategory.map(
                        (photo) => {
                            if (photo.id === action.newComment.photoId) {
                                return {
                                    ...photo,
                                    averageRating: action.newAverageRating,
                                };
                            }
                            return photo;
                        }
                    ),
                };
            }
        );

        return {
            ...state,
            allCommentsById: updatedAllComments,
            gallery: updatedGallery,
        };
    })
);
