// import jwt from 'jsonwebtoken';
// import { AuthenticationError } from 'apollo-server-express';
import decode from 'jwt-decode';

class AuthService {
 getProfile() {
   return decode(this.getToken());
 }

 loggedIn() {
   const token = this.getToken();
   return !!token && !this.isTokenExpired(token);
 }

 isTokenExpired(token) {
   try {
     const decoded = decode(token);
     if (decoded.exp < Date.now() / 1000) {
       return true;
     } else return false;
   } catch (err) {
     return false;
   }
 }

 getToken() {
   return localStorage.getItem('id_token');
 }

 login(idToken) {
   localStorage.setItem('id_token', idToken);
   window.location.assign('/');
 }

 logout() {
   localStorage.removeItem('id_token');
   window.location.assign('/');
 }

//  getUserFromToken(token) {
//    if (!token) throw new AuthenticationError('You must be logged in!');

//    try {
//      const user = jwt.verify(token, process.env.JWT_SECRET);
//      if (user) {
//        return user;
//      }
//      throw new Error('Invalid token');
//    } catch (err) {
//      throw new Error('Invalid token');
//    }
//  }
}

export default new AuthService();

