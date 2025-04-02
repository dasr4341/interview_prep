import React, {useState } from "react";
import CreateBlog from "../../components/modal/CreateBlog-Modal";
import LoginRegisterModal from "../../components/modal/LoginRegister-Modal";
import Header from "./components/Header";
import ContentSection from "./components/ContentSection";

function HomePage() {
  const [createBlogModal, setCreateBlogModal] = useState(false);
  const [loginRegModal, setLoginRegModal] = useState(false);

  return (
    <section className="relative h-screen ">

      {/* header */}
      <Header/>

      {/* content section */}
      <ContentSection showModal={() =>setCreateBlogModal(true)} />
      
      {/* modals */}
      {createBlogModal && (
        <CreateBlog CloseModal={() => setCreateBlogModal(false)} />
      )}
      
      {loginRegModal && (
        <LoginRegisterModal CloseModal={() => setLoginRegModal(false)} />
      )}

    </section>
  );
}

export default HomePage;
