export interface IUserProject {
  username: string;
  _id: string;
}

export interface IProjectItem {
  _id: string;
  name: string;
  setErrorMessage: Function;
  owner: boolean;
  user: IUserProject;
  guestUser: IUserProject[];
}
