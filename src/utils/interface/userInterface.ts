export interface UserInterface {
  email: string;
  name: string;
  image: string;
  userType: "GUEST" | "USER" | "";
  [key: string]: any;
}
