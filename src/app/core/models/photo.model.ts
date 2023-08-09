export class Photo {
  constructor(
    public filename: string = '',
    public title: string ='',
    public category: string ='',
    public description?: string,
    public year?: Number,
    public place?: string,
    public viewsNr?: number,
    public id?: number,
    public averageRating?: number
  ) {}
}
