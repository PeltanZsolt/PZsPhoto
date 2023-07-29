import { Observable } from 'rxjs';

export class MenuItem {
    constructor(
        public name: string,
        public cond$: Observable<boolean>,
        public action: string,
        public route: string
    ) {}
}
