export interface UserInterface {
  id?: string;
  email: string;
  name: string;
  image: string;
  userType: "GUEST" | "USER" | "";
  role?: string;
  [key: string]: any;
}
