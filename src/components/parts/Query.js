export const accountQuery = "" +
"id name";

export const authQuery = "" +
"status expire " +
"account { id name }";

export const loginQuery = "" +
"status expire token " +
"account { id name }";


export const contractSpacesQuery = "" +
"edges { node { pk name contractStart contractEnd } }";

export const spacesQuery = "" +
"edges { node { pk name thumbnailImage updatedDate } } " +
"pages totalCount perPage currentPage";

export const spaceQuery = "" +
"pk name mainImage description price contractStatus updatedDate";

export const topSpaceQuery = "" +
"edges { node { pk name thumbnailImage updatedDate } }";

export const topNewsQuery = "" +
"edges { node { pk name activeDate } }";

export const newsQuery = "" +
"edges { node { pk name content activeDate } } " +
"pages totalCount perPage currentPage";

export const newsItemQuery = "" +
"pk name content activeDate";

export const errorQuery = "" +
"field message";
