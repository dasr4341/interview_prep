import { useEffect } from "react";
import axios from "axios";

const Success = () => {
  const id = new URL(window.location.toString()).searchParams.get("session_id");
  // localhost:3000/success?session_id=cs_test_a1igypYlTSnV7PqjiVvXsZ0TuzUkj93izOuJeucfagFXzXPxExCRjKHZ22

  const axiosInstance = axios.create({
    baseURL: "http://localhost:4242",
  });

  async function getSessionData(id) {
    const response = await axiosInstance.get(
      `/order/success/?session_id/${id}`
    );
    console.log("response", response);
  }

  useEffect(() => {
    getSessionData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Success</h1>
      <h2>Thank you for your purchase!</h2>
    </div>
  );
};

export default Success;
