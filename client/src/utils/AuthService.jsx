const AuthService = {
  login: async (email, rollno, type, password) => {
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, rollno, type, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("rollno", data.rollno);
        window.dispatchEvent(new Event("authChange")); 
        return true;
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("rollno");
    window.dispatchEvent(new Event("authChange")); 
  },

  isAuthenticated: () => !!localStorage.getItem("token"),
};

export default AuthService;
