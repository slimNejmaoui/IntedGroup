export class Comment {
    constructor(
      public _id: string,
      public user: any,
      public publication: string,
      public text: string,
      public created_at: string
    ) {}
  }
  