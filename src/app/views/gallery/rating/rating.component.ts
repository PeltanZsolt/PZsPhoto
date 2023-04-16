import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
    @Input('averageRating') averageRating: number;
    @Input('height') height: number;
    @Input('colorful') colorful = false;
    @Input('showStar0') showStar0 = false;

    starsClass ='';

    starNone = '../../../../assets/icons/star_none.svg';
    starOutline = '../../../../assets/icons/star_outline.svg';
    starFilled = '../../../../assets/icons/star_fill.svg';
    constructor() {}

    ngOnInit(): void {
        if (this.height) {
            document.documentElement.style.setProperty(
                '--height',
                this.height + 'rem'
            );
            this.starsClass = 'big'
        }
        if (this.colorful) {
            this.starsClass = this.starsClass + ' filter-green'
        }
    }
}
