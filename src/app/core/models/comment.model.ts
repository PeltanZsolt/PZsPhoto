export class Comment {
  constructor(
    public photoId: number,
    public user: string,
    public comment: string,
    public rating: number,
    public id?: number
  ){}
}
