import React from "react";
import { LoginContext } from "../contexts/LoginContext";

const UserAccount = () => {
   const {userData, userRole} = React.useContext(LoginContext);

  return (
    <>
      <h1>Korisnik:</h1>
      {userData ? (
        <div>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      ) : (
        <p>Korisnički podaci nisu nađeni!</p>
      )}
      {userRole ? (
        <div>
          <pre>{JSON.stringify(userRole, null, 2)}</pre>
        </div>
      ) : (
        <p>Uloga korisnika nije nađena!</p>
      )}
    </>
  );
};

export default UserAccount;
