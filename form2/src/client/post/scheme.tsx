export interface Post {
    id: number;
    title: string;
    content: string;
    contentType: string;
    age: string | null;
    public: boolean;
    foodOrange: boolean;
    foodApple: boolean;
    foodBanana: boolean;
    foodMelon: boolean;
    foodGrape: boolean;
    datePublish: string | null;
    dateUpdate: string | null;
    postNumber: string | null;
    addressCountry: string | null;
    addressPref: string | null;
    addressCity: string | null;
    address1: string | null;
    address2: string | null;
    textOption1: string | null;
    textOption2: string | null;
}

export type PostInput = Omit<Post, 'id'>;