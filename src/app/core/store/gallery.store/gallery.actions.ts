import { createAction } from '@ngrx/store';

export const FetchMetaDatasStart = createAction('[gallery] Fetch MetaDatas Start');
export const FetchsMetaResults = createAction('[gallery] Fetch MetaDatas Results');

export const FetchCommentsStart = createAction('[gallery] Fetch Comments Start');
export const FetchCommentsResults = createAction('[gallery] Fetch Comments Results');

export const NewCommentStart = createAction('[gallery] New Comment Start');
export const NewCommentError = createAction('[gallery] New Comment Error');
export const NewCommentSuccess = createAction('[gallery] New Comment Success');

