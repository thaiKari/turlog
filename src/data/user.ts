import { selector } from "recoil";

export interface User {
    clientPrincipal: ClientPrincipal | null;
}

export interface ClientPrincipal {
    userId:           string;
    userRoles:        string[];
    identityProvider: string;
    userDetails:      string;
}

export const userRoles = {
	AUTHENTICATED: "authenticated",
	ANONYMOUS: "anonymous",
	CONTRIBUTOR: "contributor",
}

export const userState = selector<User>({
    key: 'userState',
    get:  async () => {
        return await (await fetch(`/.auth/me`)).json();
      }
});

export const isLoggedInState = selector<boolean>({
    key: 'isLoggedInState',
    get:  async ({get}) => {
        const user = get(userState)
        return user.clientPrincipal !== null
      }
});

export const isContributorState = selector<boolean>({
    key: 'isContributorState',
    get:  async ({get}) => {
        const user = get(userState)
        
        if (!user.clientPrincipal) return false;
        return user.clientPrincipal.userRoles.includes(userRoles.CONTRIBUTOR)      
      }
});