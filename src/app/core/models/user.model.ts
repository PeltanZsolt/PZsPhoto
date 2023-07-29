export class User {
    constructor(
        public username?: string,
        public password?: string,
        public passwordVerify?: string,
        public id?: number,
        public jwtToken?: string,
        public isAdmin?: boolean
    ) {}
}
