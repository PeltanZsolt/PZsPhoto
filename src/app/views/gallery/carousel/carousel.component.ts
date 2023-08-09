import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
    Subscription,
    switchMap,
    tap,
    map,
    of,
    distinctUntilChanged,
} from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PhotoService } from '../../../core/services/photo.service';
import { CommentService } from '../../../core/services/comment.service';
import { Comment } from '../../../core/models/comment.model';
import { Photo } from '../../../core/models/photo.model';
import { ErrorDialogData } from '../../../core/models/error.dialog.data.model';
import { ErrordialogComponent } from '../../common/errordialog/errordialog.component';
import { SocketService } from 'src/app/core/services/socket.service';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from 'src/app/core/store/auth.store/auth.reducer';
import {
    CommentsById,
    GalleryState,
} from 'src/app/core/store/gallery.store/gallery.reducers';
import { GalleryByCategory } from 'src/app/core/store/gallery.store/gallery.reducers';
import * as GalleryActions from '../../../core/store/gallery.store/gallery.actions';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, AfterContentInit, OnDestroy {
    id: number;
    photoAttributes: Photo;
    photoUrl: ArrayBuffer;
    nextRoute = '';
    previousRoute = '';
    arrowLeft: HTMLElement;
    arrowRight: HTMLElement;
    showNewComment = false;
    newComment: Comment;
    newCommentText: string;
    newRating = 0;
    commentForm: FormGroup;
    comments: Comment[] = [];
    isLoggedIn = false;
    subscriptions: Subscription[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private photoService: PhotoService,
        private dialog: MatDialog,
        private authStore: Store<AuthState>,
        private galleryStore: Store<GalleryState>,
        private socketService: SocketService
    ) {}

    getCommentsFromStore(state: GalleryState, photoId: number): CommentsById {
        let commentsById: CommentsById;
        commentsById = state.allCommentsById.filter((commentsById) => {
            return commentsById.photoId === photoId;
        })[0];
        return commentsById;
    }

    ngOnInit(): void {
        let category = '';

        const createGallerySelector = createSelector(
            createFeatureSelector<GalleryState>('gallery'),
            (state) => state.gallery
        );

        const photoSubscription = this.route.params
            .pipe(
                switchMap((params) => {
                    this.id = Number(params['id']);
                    category = params['category'];
                    return this.galleryStore.select(createGallerySelector);
                }),
                map((gallery: GalleryByCategory[]) => {
                    const photos = gallery.find(
                        (galleryByCategory) =>
                            galleryByCategory.category === category
                    )?.photosByCategory;
                    const photo: Photo = photos?.find(
                        (photo) => photo.id === this.id
                    )!;
                    if (!photos || !photo) {
                        this.galleryStore.dispatch(
                            GalleryActions.FetchCategoryStart({ category })
                        );
                        return this.id;
                    }
                    this.photoAttributes = photo;
                    this.setArrows(photos);
                    return this.id;
                }),
                distinctUntilChanged(),
                tap(() => {
                    this.galleryStore.dispatch(
                        GalleryActions.IncrementViewsNrStart({
                            photoId: this.id,
                        })
                    );
                }),
                switchMap(() => {
                    return this.photoService.getPhotoBlob(this.id!);
                })
            )
            .subscribe((res) => {
                this.getPhotoBlob(res);
            });
        this.subscriptions.push(photoSubscription);

        const createCommentsSelector = createSelector(
            createFeatureSelector<GalleryState>('gallery'),
            (state) => state.allCommentsById
        );

        const commentsSubscription = this.route.params
            .pipe(
                switchMap((params: Params) => {
                    this.id = Number(params['id']);
                    return this.galleryStore
                        .select(createCommentsSelector)
                        .pipe(
                            map((allCommentsById: CommentsById[]) =>
                                allCommentsById.find(
                                    (commentsById) =>
                                        commentsById.photoId === this.id
                                )
                            )
                        );
                }),
                switchMap((commentsById) => {
                    if (!commentsById || !commentsById.photoId) {
                        this.galleryStore.dispatch(
                            GalleryActions.FetchCommentsStart({
                                photoId: this.id,
                            })
                        );
                    } else {
                        this.comments = commentsById.comments;
                    }
                    return of();
                })
            )
            .subscribe();
        this.subscriptions.push(commentsSubscription);

        document.ondblclick = () => this.toggleFullScreen();
        document.onkeydown = this.listenToKeys;
        window.onresize = () => this.resizeElements();

        this.commentForm = new FormGroup({
            newCommentText: new FormControl(
                this.newCommentText,
                Validators.required
            ),
        });

        this.subscriptions.push(
            this.authStore
                .select(createFeatureSelector<AuthState>('auth'))
                .subscribe((state) => {
                    this.isLoggedIn = !!state.user.username;
                })
        );

        this.subscriptions.push(
            this.socketService.socketCommentEvent.subscribe((event: any) => {
                if (event.newComment.photoId === Number(this.id)) {
                    const newComment = {
                        photoId: this.id,
                        user: event.newComment.user,
                        commentText: event.newComment.commentText,
                        rating: Number(event.newComment.rating),
                        viewsNr: event.newComment.viewsNr,
                    };
                    this.galleryStore.dispatch(
                        GalleryActions.PostCommentSuccess({
                            newComment,
                            newAverageRating: event.newAverageRating,
                        })
                    );
                }
            })
        );
    }

    getPhotoBlob(res: any) {
        const reader = new FileReader();
        const blob = res as Blob;
        reader.onload = () => {
            this.photoUrl = reader.result as ArrayBuffer;
        };
        reader.readAsDataURL(blob);
    }

    setArrows(photos: Photo[]) {
        this.previousRoute = '';
        this.nextRoute = '';
        this.arrowLeft = document.getElementById('arrow-left')!;
        this.arrowRight = document.getElementById('arrow-right')!;
        this.enableArrowEl(this.arrowLeft);
        this.enableArrowEl(this.arrowRight);
        this.getPreviousRoute(photos);
        this.getNextRoute(photos);
    }

    listenToKeys = (event: KeyboardEvent) => {
        this.handleArrowNavigation(event.code);
    };

    onArrowClick(event: string) {
        this.handleArrowNavigation(event);
    }

    resizeElements() {
        if (document.fullscreenElement) {
            this.setImageHeightToFullScreen();
        } else {
            this.setImageHeightToWindow();
        }
    }

    handleArrowNavigation(event: string) {
        switch (event) {
            case 'ArrowLeft':
                if (this.previousRoute) {
                    this.router.navigate([
                        '/gallery/' +
                            this.photoAttributes.category +
                            '/' +
                            this.previousRoute,
                    ]);
                }
                break;
            case 'ArrowRight':
                if (this.nextRoute) {
                    this.router.navigate([
                        '/gallery/' +
                            this.photoAttributes.category +
                            '/' +
                            this.nextRoute,
                    ]);
                }
                break;
            default:
                return;
        }

        this.resetCommentsForm();
    }

    toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.getElementById('pagination')!.requestFullscreen();
            this.setImageHeightToFullScreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    getPreviousRoute(photos: Photo[]) {
        const previousPhotos = photos.filter((photo) => photo.id! < this.id);
        if (previousPhotos.length === 0) {
            this.enableArrowEl(this.arrowRight);
            this.disableArrowEl(this.arrowLeft);
            return;
        }
        const idsList = previousPhotos.map((photo) => Number(photo.id));
        const maxId = Math.max(...idsList).toString();
        this.previousRoute = maxId;
    }

    getNextRoute(photos: Photo[]) {
        const nextPhotos = photos.filter((photo) => photo.id! > this.id);
        if (nextPhotos.length === 0) {
            this.enableArrowEl(this.arrowLeft);
            this.disableArrowEl(this.arrowRight);
            return;
        }
        const idsList = nextPhotos.map((photo) => Number(photo.id));
        const minId = Math.min(...idsList).toString();
        this.nextRoute = minId;
    }

    setImageHeightToWindow() {
        const headerHeight =
            document.getElementById('header-bar')!.clientHeight;
        const footerHeight = document.getElementById('footer')!.clientHeight;
        const viewHeight = window.visualViewport!.height;
        const imageHeight = (
            viewHeight -
            headerHeight -
            footerHeight -
            20
        ).toString();
        document.documentElement.style.setProperty(
            '--image-height',
            imageHeight + 'px'
        );
    }

    setImageHeightToFullScreen() {
        const viewHeight = window.visualViewport!.height;
        const imageHeight = (viewHeight - 20).toString();
        document.documentElement.style.setProperty(
            '--image-height',
            imageHeight + 'px'
        );
    }

    enableArrowEl(element: HTMLElement) {
        element.style.pointerEvents = 'auto';
        const child = element.children[0] as HTMLElement;
        child.style.color = 'white';
        child.style.textShadow = '0 0 10px black';
    }

    disableArrowEl(element: HTMLElement) {
        element.style.pointerEvents = 'none';
        const child = element.children[0] as HTMLElement;
        child.style.color = 'rgba(0, 0, 0, 0.5)';
        child.style.textShadow = 'none';
    }

    onAddNewComment() {
        if (this.isLoggedIn) {
            return (this.showNewComment = true);
        }
        const data: ErrorDialogData = {
            messageHeader: 'Please login first!',
            messageBody: 'In order to post comments you need to log in!',
            duration: 4000,
        };
        this.dialog.open(ErrordialogComponent, { data: data });
        return;
    }

    onCancelNewComment() {
        this.showNewComment = false;
        this.resetCommentsForm();
    }

    onRatingClicked(event: any) {
        this.newRating = event.target.id.slice(4).toString();
    }

    onUploadComment() {
        if (!this.newRating) {
            const messageHeader = '';
            const messageBody = 'Please give a rating by clicking on stars!';
            this.dialog.open(ErrordialogComponent, {
                data: { messageHeader, messageBody },
            });
            return;
        }
        this.newCommentText = this.commentForm.value.newCommentText;
        this.subscriptions.push(
            this.authStore
                .select(createFeatureSelector<AuthState>('auth'))
                .pipe(
                    map((state: AuthState) => {
                        const newComment: Comment = {
                            photoId: this.photoAttributes.id!,
                            user: state.user.username!,
                            commentText: this.newCommentText,
                            rating: this.newRating,
                        };
                        this.galleryStore.dispatch(
                            GalleryActions.PostCommentStart({ newComment })
                        );
                    })
                )
                .subscribe()
        );
    }

    resetCommentsForm() {
        this.showNewComment = false;
        this.commentForm.reset();
        this.newRating = 0;
    }

    ngAfterContentInit() {
        this.resizeElements();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
        document.onkeydown = null;
    }
}
