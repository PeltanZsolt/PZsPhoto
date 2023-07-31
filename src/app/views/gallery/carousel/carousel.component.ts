import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, forkJoin, switchMap, tap, concat, of, map } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
// import { AuthService } from '../../../core/services/auth.service.ts todelete';
import { PhotoService } from '../../../core/services/photo.service';
import { CommentService } from '../../../core/services/comment.service';
import { ViewsService } from '../../../core/services/views.services';
import { Comment } from '../../../core/models/comment.model';
import { Photo } from '../../../core/models/photo.model';
import { ErrorDialogData } from '../../../core/models/error.dialog.data.model';
import { ErrordialogComponent } from '../../common/errordialog/errordialog.component';
import { SuccessdialogComponent } from '../../common/successdialog/successdialog.component';
import { SocketService } from 'src/app/core/services/socket.service';
import { Store, createFeatureSelector } from '@ngrx/store';
import { AuthState } from 'src/app/core/auth.store/auth.reducer';

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
        private commentService: CommentService,
        private dialog: MatDialog,
        // private authService: AuthService,
        private store: Store<AuthState>,
        private viewsService: ViewsService,
        private socketService: SocketService
    ) {}

    ngOnInit(): void {
        const subscription = this.route.params
            .pipe(
                switchMap((params: Params) => {
                    this.id = params['id'];
                    return forkJoin([
                        this.photoService.getPhotoBlob(this.id),
                        this.commentService.getCommentsByPhotoId(this.id),
                        concat(
                            this.viewsService.incrementViewsNr(Number(this.id)),
                            this.photoService.getPhotoAttributes(this.id)
                        ),
                    ]);
                }),
                tap((res) => {
                    this.getPhotoBlob(res[0]);
                    this.getComments(res[1]);
                    this.getPhotoAttributes(res[2][0]);
                })
            )
            .subscribe();
        this.subscriptions.push(subscription);

        document.onkeydown = this.listenToKeys;
        window.onresize = () => this.resizeElements();

        this.commentForm = new FormGroup({
            newCommentText: new FormControl(
                this.newCommentText,
                Validators.required
            ),
        });

        this.subscriptions.push(
            this.store
                .select(createFeatureSelector<AuthState>('auth'))
                .subscribe((state) => {
                    this.isLoggedIn = !!state.user.username;
                })
            // this.authService.authEvent$.subscribe(event => {
            //     this.isLoggedIn = event.isLoggedIn
            // })
        );

        this.subscriptions.push(
            this.socketService.socketCommentEvent.subscribe((event) => {
                if (event.photoId === Number(this.id)) {
                    const newComment = {
                        photoId: this.id,
                        user: event.user,
                        commentText: event.commentText,
                        rating: Number(event.rating),
                        viewsNr: event.viewsNr,
                    };
                    this.comments.unshift(newComment);
                }
            })
        );
    }

    getPhotoBlob(res0: any) {
        const reader = new FileReader();
        const blob = res0 as Blob;
        reader.onload = () => {
            this.photoUrl = reader.result as ArrayBuffer;
        };
        reader.readAsDataURL(blob);
    }

    getComments(res1: any) {
        this.comments = res1;
    }

    getPhotoAttributes(res2: any) {
        this.photoAttributes = res2;
        this.previousRoute = '';
        this.nextRoute = '';
        this.arrowLeft = document.getElementById('arrow-left')!;
        this.arrowRight = document.getElementById('arrow-right')!;
        this.enableArrowEl(this.arrowLeft);
        this.enableArrowEl(this.arrowRight);
        this.getPreviousRoute();
        this.getNextRoute();
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
            case 'Enter':
            case 'NumpadEnter':
                this.toggleFullScreen();
                break;
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

    getPreviousRoute() {
        const subscription = this.photoService
            .getPhotoListByCategory(this.photoAttributes.category)
            .subscribe((res: Photo[]) => {
                const previousPhotos = res.filter((photo) => {
                    return photo.id! < this.id;
                });
                if (previousPhotos.length === 0) {
                    this.enableArrowEl(this.arrowRight);
                    this.disableArrowEl(this.arrowLeft);
                    return;
                }
                const idsList = previousPhotos.map((photo) => Number(photo.id));
                const maxId = Math.max(...idsList).toString();
                this.previousRoute = maxId;
            });
        this.subscriptions.push(subscription);
    }

    getNextRoute() {
        const subscription = this.photoService
            .getPhotoListByCategory(this.photoAttributes.category)
            .subscribe((res: Photo[]) => {
                const nextPhotos = res.filter((photo) => {
                    return photo.id! > this.id;
                });
                if (nextPhotos.length === 0) {
                    this.enableArrowEl(this.arrowLeft);
                    this.disableArrowEl(this.arrowRight);
                    return;
                }
                const idsList = nextPhotos.map((photo) => Number(photo.id));
                const minId = Math.min(...idsList).toString();
                this.nextRoute = minId;
            });
        this.subscriptions.push(subscription);
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
            this.store
                .select(createFeatureSelector<AuthState>('auth'))
                .pipe(
                    map((state: AuthState) =>{
                         const newComment: Comment = {
                            photoId: this.photoAttributes.id!,
                            user: state.user.username!,
                            commentText: this.newCommentText,
                            rating: this.newRating,
                            // viewsNr: 1,
                        };
                        return newComment;
                    }),
                    switchMap((newComment: Comment) =>
                        this.commentService
                            .postComment(newComment)
                            .pipe(
                                tap((res: any) => {
                                    if (res.error) {
                                        this.dialog.open(ErrordialogComponent, {
                                            data: {
                                                messageHeader:
                                                    'An error occured on the remote server:',
                                                message: res.error.message,
                                            },
                                        });
                                        return;
                                    }
                                    if (res.averageRating) {
                                        const successMessage = 'Comment uploaded successfuly';
                                        this.dialog.open(SuccessdialogComponent, {
                                            data: {
                                                message: successMessage,
                                                duration: 2000,
                                            },
                                        });
                                    }
                                    this.comments.unshift(newComment);
                                    this.resetCommentsForm();
                                    this.photoAttributes.averageRating = res.averageRating;
                                })
                            )
                    )
                )
                .subscribe()
        );
        // const subscription =
        //     .subscribe();
        // this.subscriptions.push(subscription);
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
