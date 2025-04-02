const olx = "https://www.olx.in/";
const API_BASE_URL = "https://xcars-backend.x-studio.io/graphql";
import queryGetEstimate from "./query/queryGetEstimate.query.js";
import querySubmitOtp from "./query/querySubmitOtp.query.js";
import queryLoginRequestOtp from "./query/queryLoginRequestOtp.query.js";

chrome.webNavigation.onCompleted.addListener(
  (details) => {
    if (details.frameId === 0) {
      chrome.scripting.insertCSS({
        target: { tabId: details.tabId },
        files: ["styles.css"],
      });

      injectScript(
        details.tabId,
        API_BASE_URL,
        queryGetEstimate,
        queryLoginRequestOtp,
        querySubmitOtp
      );
    }
  },
  { url: [{ schemes: ["http", "https"] }] }
);


chrome.action.onClicked.addListener(async (tab, ...all) => {
  injectScript(
    tab.id,
    API_BASE_URL,
    queryGetEstimate,
    queryLoginRequestOtp,
    querySubmitOtp
  );
});


function injectScript(
  tabId,
  API_BASE_URL,
  queryGetEstimate,
  queryLoginRequestOtp,
  querySubmitOtp
) {
  chrome.scripting.executeScript({
    target: { tabId },
    args: [
      API_BASE_URL,
      queryGetEstimate,
      queryLoginRequestOtp,
      querySubmitOtp,
    ],
    func: async function (
      API_BASE_URL,
      queryGetEstimate,
      queryLoginRequestOtp,
      querySubmitOtp
    ) {
      let isAuth = {
        status: false,
        token: null,
      };

      async function getApiData(query, variables) {
        let res = null;
        try {
          res = await (
            await fetch(API_BASE_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                app: "WEB",
                Authorization: `Bearer ${isAuth.token || ""}`, // Optional
              },
              body: JSON.stringify({ query, variables }),
            })
          ).json();
        } catch (e) {
          console.log({ error: e });
        } finally {
          return res;
        }
      }

      function addOptions(variantList, mentionedVariant, select) {
        select.innerHTML = "";
        variantList.forEach((optionData) => {
          const option = document.createElement("option");
          option.value = optionData.value;
          option.textContent = optionData.text;

          // Set default selected value
          if (option.value === mentionedVariant) {
            option.selected = true;
          }
          select.appendChild(option);
        });
      }

      function initOrResetLoginForm(
        numberInput,
        otpInput,
        requestOtpButton,
        loginButton,
        errorElement
      ) {
        errorElement.innerHTML = "";

        requestOtpButton.disabled = false;
        requestOtpButton.style.cursor = "pointer";
        requestOtpButton.innerText = "Proceed  〉〉〉";
        requestOtpButton.style.display = "block";

        numberInput.disabled = false;
        numberInput.style.display = "block";

        otpInput.style.display = "none";
        otpInput.disabled = false;
        otpInput.value = "";

        loginButton.innerText = "Submit";
        loginButton.disabled = false;
        loginButton.style.cursor = "pointer";
        loginButton.style.display = "none";
      }

      function createForm() {
        const formDiv = document.createElement("div");

        const form = document.createElement("form");
        form.setAttribute("id", "loginForm");

        // Create heading
        const headerContainer = document.createElement("div");
        headerContainer.classList.add("form-header");
        const errorElement = document.createElement("div");
        errorElement.classList.add("form-error");

        const heading = document.createElement("div");
        heading.innerText = "Sign-In 🤩 🤩 To get the Best Price 🔖";

        const closeBtn = document.createElement("button");
        closeBtn.innerHTML = "╳";
        closeBtn.classList.add("close-btn");

        headerContainer.appendChild(heading);
        headerContainer.appendChild(closeBtn);

        const phoneInput = document.createElement("input");
        phoneInput.setAttribute("type", "text");
        phoneInput.setAttribute("id", "phone");
        phoneInput.setAttribute("name", "phone");
        phoneInput.setAttribute("placeholder", "Enter Phone");

        const otpInput = document.createElement("input");
        otpInput.setAttribute("type", "text");
        otpInput.setAttribute("id", "otp");
        otpInput.setAttribute("name", "otp");
        otpInput.setAttribute("placeholder", "Enter otp");

        // Create login button
        const loginButton = document.createElement("button");
        loginButton.setAttribute("type", "submit");
        loginButton.classList.add("submit-button");
        loginButton.classList.add("shining-btn");

        const requestOtpButton = document.createElement("button");
        requestOtpButton.setAttribute("type", "button");
        requestOtpButton.classList.add("request-otp-button");
        requestOtpButton.classList.add("shining-btn");

        initOrResetLoginForm(
          phoneInput,
          otpInput,
          requestOtpButton,
          loginButton,
          errorElement
        );

        // Add event listener for form submission

        // Append elements to form
        form.appendChild(headerContainer);
        form.appendChild(phoneInput);
        form.appendChild(otpInput);
        form.appendChild(errorElement);
        form.appendChild(requestOtpButton);
        form.appendChild(loginButton);

        formDiv.appendChild(form);
        formDiv.classList.add("form-container");

        return {
          form: formDiv,
          number: phoneInput,
          otp: otpInput,
          requestOtpButton,
          loginButton,
          errorElement,
          closeBtn,
        };
      }

      function createInfoArea(
        variables,
        actualPrice,
        estimatedPrice,
        isAuth,
        variant
      ) {
        const infoArea = document.createElement("div");
        infoArea.classList.add("x-cars-info");

        const variantWarning = document.createElement("div");
        if (!variables.variantName || !variant.length) {
          variantWarning.classList.add("variant");
          variantWarning.innerHTML = !!variant.length
            ? "OOPS NO VARIANT FOUND !! Please Select a variant to continue"
            : "Please login to continue.";
        }
        // -----------------------------------------------
        const select = document.createElement("select");
        // Create options
        addOptions(variant, variables.variantName, select);
        // -----------------------------------------------

        const carInfo = document.createElement("div");
        carInfo.classList.add("carInfo");
        carInfo.innerText = `${variables.company} ${variables.model} | ${
          variables.year
        } | ${variables.fuelType} | ${variables.transmissionType} ${
          variables.variantName && " | " + variables.variantName
        }`;

        const showModalBtn = document.createElement("button");
        const showModalBtnDiv = document.createElement("div");
        showModalBtnDiv.classList.add("login-to-view-container");
        showModalBtn.innerText = "Login to view !";
        showModalBtn.classList.add("login-to-view-btn");

        const estimatedPriceElement = document.createElement("div");
        estimatedPriceElement.classList.add("estimated-price");

        const estimatedCarPriceValueElement = document.createElement("div");
        estimatedCarPriceValueElement.classList.add("estimated-price-value");

        // this is the price div
        const estimatedCarPriceValue = document.createElement("div");

        const estimatedCarPriceTitle = document.createElement("span");
        estimatedCarPriceTitle.innerText = `Our estimated price : `;

        estimatedCarPriceValueElement.appendChild(estimatedCarPriceTitle);
        estimatedCarPriceValueElement.appendChild(estimatedCarPriceValue);

        const span = document.createElement("span");
        span.innerText = "Estimated Price";

        showModalBtnDiv.appendChild(span);
        showModalBtnDiv.appendChild(showModalBtn);

        estimatedCarPriceValue.innerText =
          Number(estimatedPrice).toLocaleString();
        estimatedPriceElement.appendChild(estimatedCarPriceValueElement);
        estimatedPriceElement.appendChild(showModalBtnDiv);

        if (isAuth.token) {
          estimatedCarPriceValueElement.style.display = "flex";
          showModalBtnDiv.style.display = "none";
        } else {
          estimatedCarPriceValueElement.style.display = "none";
          showModalBtnDiv.style.display = "flex";
        }

        const actualPriceElement = document.createElement("div");
        actualPriceElement.innerHTML = `Actual Price : ${Number(
          actualPrice
        ).toLocaleString()} (ex show room)`;

        infoArea.appendChild(estimatedPriceElement);
        infoArea.appendChild(actualPriceElement);
        infoArea.appendChild(carInfo);

        infoArea.appendChild(variantWarning);
        infoArea.appendChild(select);
        return {
          infoArea,
          select,
          estimatedCarPriceValue,
          estimatedCarPriceValueElement,
          estimatedPriceElement,
          actualPriceElement,
          showModalBtnDiv,
          variantWarning,
        };
      }

      // -------------------- GETTING DATA FORM OLX ------------------------------------------
      // --------------------------------------------------------------
      const element = document.querySelector("[data-aut-id='breadcrumb']");
      const carTitle = document.querySelector('[data-aut-id="itemTitle"]');
      const fuel = document.querySelector(
        '[data-aut-id="itemAttribute_fuel"]'
      ).innerText;
      const milage = document.querySelector(
        '[data-aut-id="itemAttribute_mileage"]'
      );
      const transmission = document.querySelector(
        '[data-aut-id="itemAttribute_transmission"]'
      ).innerText;

      const [company, model, year] =
        carTitle.innerText.replaceAll("(", "").replaceAll(")", "").split(" ") ||
        "";

      const variant = document.querySelector('[data-aut-id="leftPanel"]')
        .firstElementChild.firstElementChild.firstElementChild.children[2]
        .innerText;

      const variables = {
        model,
        year,
        fuelType: fuel,
        transmissionType: String(transmission).toLowerCase().includes("manual")
          ? "MT"
          : "AT",
        variantName: variant,
        company,
      };

      // --------------------- GETTING DATA FROM API -----------------------------------------
      const res = await getApiData(queryGetEstimate, variables);
      // -------------------------------------------------------------------------------------
      const parentDiv =
        document.querySelector(".x-cars") || document.createElement("div");
      parentDiv.innerHTML = "";
      parentDiv.classList.add("x-cars");

      const header = document.createElement("div");
      header.innerText = "BEST PRICE";
      header.classList.add("header");

      const logoutBtn = document.createElement("button");
      logoutBtn.classList.add("logout-btn");
      logoutBtn.innerText = "Logout";

      header.appendChild(logoutBtn);
      parentDiv.appendChild(header);
      // -----------

      const {
        infoArea: infoAreaElement,
        select,
        estimatedCarPriceValue,
        estimatedCarPriceValueElement,
        actualPriceElement,
        showModalBtnDiv,
        variantWarning,
      } = createInfoArea(
        variables,
        res?.data?.getCarsDetailsExtension?.actualPrice || "NA",
        res?.data?.getCarsDetailsExtension?.estimatedPrice || "NA",
        isAuth,
        res?.data?.getCarsDetailsExtension?.variant || []
      );

      // Create the form element
      const {
        form,
        number,
        otp: otpInput,
        requestOtpButton,
        loginButton,
        errorElement,
        closeBtn,
      } = createForm();

      function showLoginBtnOrEstimatedPrice(
        state,
        estimatedPrice = 0,
        actualPrice = 0
      ) {
        if (state) {
          estimatedCarPriceValueElement.style.display = "none";
          showModalBtnDiv.style.display = "flex";
        } else {
          estimatedCarPriceValueElement.style.display = "flex";
          showModalBtnDiv.style.display = "none";
          estimatedCarPriceValue.innerText = `₨ ${Number(
            estimatedPrice
          ).toLocaleString()}`;
        }
        actualPriceElement.innerHTML = `Actual Price : ₨ ${Number(
          actualPrice
        ).toLocaleString()} (ex show room)`;
      }

      function showLoginModal(state) {
        const formContainer = document.querySelector(".form-container");
        formContainer.style.display = state ? "block" : "none";
        errorElement.innerText = "";
        variantWarning.innerText = "";
      }

      parentDiv.appendChild(infoAreaElement);
      parentDiv.appendChild(form);

      // -----------------------------------------------------------------------------------------------------------
      // ------------------------------------------------ Event listeners ------------------------------------------
      // -----------------------------------------------------------------------------------------------------------

      select.onchange = async function () {
        const selectOnChangeResponse = await getApiData(queryGetEstimate, {
          ...variables,
          variantName: select?.value || null,
        });
        showLoginBtnOrEstimatedPrice(
          false,
          selectOnChangeResponse.data.getCarsDetailsExtension.estimatedPrice,
          selectOnChangeResponse.data.getCarsDetailsExtension.actualPrice
        );
      };

      requestOtpButton.addEventListener("click", async function (event) {
        event.preventDefault(); // Prevent page reload
        const phoneNumber = number.value;
        try {
          if (phoneNumber.length !== 10) {
            errorElement.innerText = "Please enter a valid number";
            return;
          } else {
            errorElement.innerText = "";
          }
          requestOtpButton.disabled = true;
          requestOtpButton.style.cursor = "loading";
          requestOtpButton.innerText = "Loading ...";
          number.disabled = true;

          const res = await getApiData(queryLoginRequestOtp, {
            formData: {
              carId: "96a0c362-ba2d-4623-972b-7d9e1d5678f1",
              message: "",
            },
            registerInput: {
              firstName: "NA",
              lastName: "",
              phoneNumber,
            },
          });
          errorElement.innerText = "Otp send successfully ✅";
        } catch (e) {
          errorElement.innerText =
            e?.message || "Please try after some time !!";
        } finally {
          requestOtpButton.style.cursor = "pointer";
          requestOtpButton.style.display = "none";
          requestOtpButton.innerText = `Proceed  〉〉〉`;

          loginButton.style.display = "block";
          otpInput.style.display = "block";
          number.style.display = "none";
        }
      });

      form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page reload
        const otp = otpInput.value;
        const phoneNumber = number.value;

        if (otp.length !== 6) {
          errorElement.innerText = "Please enter a valid otp";
          return;
        } else {
          errorElement.innerText = "";
        }

        try {
          const res = await getApiData(querySubmitOtp, {
            phoneNumber,
            otp,
          });

          isAuth.token =
            res?.data?.verifyLoginPhoneOtp?.signInToken?.accessToken;
          isAuth.status = !!isAuth.token;

          if (!isAuth.status) {
            const errorText =
              "Error: cannot able to login, please try after some time";
            errorElement.innerText = errorText;
            return;
          } else {
            logoutBtn.style.display = "block";
            errorElement.innerText = res?.data?.verifyLoginPhoneOtp?.message;
          }
          loginButton.innerText = "...Submitting";
          otpInput.disabled = true;
          loginButton.disabled = true;
          showLoginModal(false);

          const estimateData = await getApiData(queryGetEstimate, variables);

          addOptions(
            estimateData?.data?.getCarsDetailsExtension?.variant || [],
            variables.variantName,
            select
          );

          showLoginBtnOrEstimatedPrice(
            false,
            estimateData?.data?.getCarsDetailsExtension?.estimatedPrice,
            estimateData?.data?.getCarsDetailsExtension?.actualPrice || 0
          );
        } catch (e) {
          errorElement.innerText =
            '"Error: cannot able to login, please try after some time';
        }
      });

      showModalBtnDiv.addEventListener("click", (e) => {
        e.preventDefault();
        showLoginModal(true);
        // const formContainer = document.querySelector(".form-container");
        // errorElement.innerText = "";
        // formContainer.style.display = "block";
      });

      logoutBtn.addEventListener("click", () => {
        isAuth = {
          status: false,
          token: null,
        };
        showLoginBtnOrEstimatedPrice(true);
        initOrResetLoginForm(
          number,
          otpInput,
          requestOtpButton,
          loginButton,
          errorElement
        );
        logoutBtn.style.display = "none";
      });

      closeBtn.addEventListener("click", async function (event) {
        event.preventDefault(); // Prevent page reload
        initOrResetLoginForm(
          number,
          otpInput,
          requestOtpButton,
          loginButton,
          errorElement
        );
        form.style.display = "none";
      });

      // Append form to body
      element.insertAdjacentElement("beforeend", parentDiv);
    },
  });
}





