export class Comment {
  constructor(
    public photoId: number,
    public user: string,
    public commentText: string,
    public rating: number,
    public id?: number
  ){}
}
