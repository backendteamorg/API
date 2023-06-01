export class CreateCommentDto {
    readonly movieid: number;
    readonly userEmail: string;
    readonly text: string;
    readonly date: string;
}