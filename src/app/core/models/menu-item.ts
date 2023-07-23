export class MenuItem {
    constructor(
        public name: string,
        public cond: boolean,
        public action: string,
        public route: string,
    ) {}
}
