export enum ROLES {
    ROOT_ADMIN = 'ROOT_ADMIN',
    ORGANIZATION_ADMIN = 'ORGANIZATION_ADMIN',
    AUTHOR = 'AUTHOR',
}

// in feature we can for multi apps we can migrate on format
// roles: [{
//     app: "DSNS"
//     roles: ['ROOT_ADMIN', 'ORGANIZATION_ADMIN'],
// }]
