// Admin
async function admin_login() {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  if (username.length > 2 && password.length > 2) {
    const req = await axios.post("/api/admin_login", {
      username,
      password,
    });
    if ((await req.data.status) == "Authenticated") {
      location.reload();
    }
  }
}

function logout() {
  document.cookie = `user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  location.reload();
}

// Function To show Prediction
function show_predidction_result(
  { confidence, classified, possible_race },
  image_data
) {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
	<div
	id="prediction-result"
	class="absolute top-0 left-0 bg-gray  h-screen w-screen
	flex flex-col justify-center items-center overflow-hidden">

	<button class="absolute top-2 right-2 text-3xl
	hover:text-red-500 z-50
	"
	onclick="
	document.querySelector('#prediction-result').remove()
	"
	>
		<i class="fa-solid fa-xmark-circle"></i>
	</button>
	
	<div class="flex w-full h-full">
	<div class="w-[30%] h-full bg-gray-800 relative border-r-4 border-green-500  ">

	<div class="absolute top-5 left-5 text-4xl font-semibold">
	<i class="fa-solid fa-circle-info"></i>
	Information: 
	</div>
	<div class="p-3 pl-5 flex flex-col space-y-4 mt-20">
	<span class="w-full">
	<span class="text-2xl">Predicted Country:</span>
	<span class="font-bold text-xl">
	${classified}
	</span>
	</span>
	<span class="w-full">
	<span class="text-2xl">Predicted Race:</span>
	<span class="font-bold text-xl">
	${possible_race.toString()}
	</span>
	</span>
	<span class="w-full">
	<span class="text-2xl">Confidence:</span>
	<span class="font-bold text-xl">
	${confidence}
	</span>
	</span>
	</div>
	</div>
	<div class="w-[70%] space-y-3 flex-col h-full bg-gray-900 flex justify-center items-center relative">
	<span class="text-4xl absolute top-5 left-5 font-semibold "> <i class="fa-solid fa-image"></i> Image Uploaded : </span>
	<img src="${image_data}" alt="Input Image For Prediction"
	class="w-[300px] h-[300px] border-4 border-green-500"
	>
	</div>
	</div>
	</div>
    `
  );
}

// Image Predict
// Check If The user is in Login Page
if (!document.title.includes("Login")) {
  const predictForm = document.getElementById("image-predict-form");
  const predictInput = document.getElementById("image-predict-input");

  // Get Image Data URI
  let image_uri;
  predictInput.addEventListener("change", function () {
    const file = this.files[0];
    const fr = new FileReader();
    fr.addEventListener("load", function () {
      const data = this.result;
      image_uri = data;
    });
    fr.readAsDataURL(file);
  });

  // Predict Image Form Event Listener
  predictForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    // File Check
    const imageFile = predictInput.files[0];
    if (!imageFile) {
      return;
    }
    // File Extension Check
    const extension = imageFile.name.split(".").pop().toLowerCase();
    if (extension !== "jpg") {
      return;
    }
    try {
      const file = imageFile;
      const config = {
        headers: {
          "Content-Type": "image/jpeg",
        },
        responseType: "json",
      };
      const response = await axios.post("/api/predict", file, config);
      predictInput.value = "";
      show_predidction_result(await response.data, image_uri);
    } catch (error) {
      console.log(error);
    }
  });
}

if (document.title.includes("Admin")) {
  async function set_countries() {
    const req = await axios("/api/classes");
    const countries = await req.data;
    countries.forEach((country) => {
      document
        .querySelector("#image-upload-class")
        .insertAdjacentHTML(
          "beforeend",
          `<option value="${country}">${country}</option>`
        );
    });
  }
  // Add Classes Dynamically
  set_countries();

  // Function to Show Image Upload Progress
  function show_image_upload_status({ status }, color, icon) {
    document.querySelector("#upload").insertAdjacentHTML(
      "afterbegin",
      `
	  <div class="w-full text-center mb-14">
		<span class="
		font-semibold text-2xl
		text-${color}-500">
		<i class="fa-solid fa-${icon}"></i>
		${status.replace(/.*, /g, "")}
		</span>
	  </div>
	  `
    );
  }

  // Admin Tabs
  // Get the tab buttons and tab contents
  const tabButtons = document.querySelectorAll(".tab-btn > button");
  const tabContents = document.querySelectorAll(".tab-content");

  const uploadForm = document.querySelector("#image-upload-form");
  const uploadImage = document.querySelector("#image-upload-input");

  uploadForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    // File Check
    const imageFile = uploadImage.files[0];
    if (!imageFile) {
      return;
    }
    // File Extension Check
    const extension = imageFile.name.split(".").pop().toLowerCase();
    if (extension !== "jpg") {
      return;
    }

    try {
      const response = await axios.post(
        `/api/add_image?class_folder=${
          document.querySelector("#image-upload-class").value
        }`,
        imageFile,
        {
          headers: {
            "Content-Type": "image/jpeg",
          },
        }
      );
      const result = await response.data;
      show_image_upload_status(result, "green", "circle-check");
    } catch (error) {
      show_image_upload_status(
        { status: "Unable to Upload!" },
        "red",
        "circle-xmark"
      );
    }
  });

  // Get Dataset
  let dnf;
  async function get_dataset() {
    const req = await axios("/api/dataset");
    const data = await req.data;
    const { dir_and_files, total_dir, total_files } = data.dataset;

    dnf = dir_and_files;
    const dirList = document.querySelector("#dir-list");
    dirList.innerHTML = "";

    document.querySelector("#total-class").textContent = total_dir;
    document.querySelector("#total-files").textContent =
      total_files + "/" + Math.floor(total_files / total_dir);

    dir_and_files.forEach((dir, i) => {
      dirList.insertAdjacentHTML(
        "beforeend",
        `
	    <li class="bg-black/30 font-semibold mb-2 cursor-pointer hover:bg-black/10 text-xl rounded-lg">
	    <button class="flex w-full outline-none p-2 rounded-lg"
	     onclick="render_files(${i})"
	    >
		  ${dir[0].dir}
	    </button>
	    </li>
	  `
      );
    });

    if (document.querySelector("#dir-list > li > button"))
      document.querySelector("#dir-list > li > button").click();

    if (document.querySelector("#file-list > li > button"))
      document.querySelector("#file-list > li > button").click();
  }

  function render_files(dirIndex) {
    Array.from(document.querySelectorAll("#dir-list > li > button")).forEach(
      (elm, i) => {
        elm.classList.remove("bg-blue-600");
        if (i == dirIndex) {
          elm.classList.add("bg-blue-600");
        }
      }
    );
    const fileList = document.querySelector("#file-list");
    fileList.innerHTML = "";
    dnf[dirIndex][0].files.forEach((file, i) => {
      fileList.insertAdjacentHTML(
        "beforeend",
        `
	    <li class="bg-black/30 font-semibold mb-2 cursor-pointer hover:bg-black/10 text-xl rounded-lg">
	    <button class="flex w-full outline-none p-2 rounded-lg"
	     onclick="render_image('${file}', ${i})"
	    >
		  ${file.replace(/.*\//g, "")}
	    </button>
	    </li>
	  `
      );
    });
  }

  function render_image(link, index) {
    Array.from(document.querySelectorAll("#file-list > li > button")).forEach(
      (elm, i) => {
        elm.classList.remove("bg-blue-600");
        if (i == index) {
          elm.classList.add("bg-blue-600");
        }
      }
    );
    document.querySelector("img#view-image").src = link;
  }

  // Function to Train the Model
  // Initalize
  get_dataset();

  // Add click event listeners to tab buttons
  tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      // Remove active class from all tab buttons and tab contents
      tabButtons.forEach((button) =>
        button.classList.remove("border-blue-500")
      );
      tabContents.forEach((content) => content.classList.add("hidden"));

      // Add active class to the clicked tab button and show the corresponding tab content
      button.classList.add("border-blue-500");
      tabContents[index].classList.remove("hidden");
    });
  });
  document.querySelector("#predict-tab").click();
}

async function train(element) {
  element.setAttribute("disabled", "");
  element.classList.toggle("cursor-not-allowed");
  document.querySelector("#train").insertAdjacentHTML(
    "afterbegin",
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="train-loader"
	style="margin-bottom: 25px; background: #00000000; display: block;" width="211px" height="211px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
 <g transform="translate(50 50)">  <g transform="translate(-19 -19) scale(0.6)"> <g>
<animateTransform attributeName="transform" type="rotate" values="0;45" keyTimes="0;1" dur="0.2s" begin="0s" repeatCount="indefinite"></animateTransform><path d="M29.91972944667338 20.020234510061712 L38.40501082091195 28.50551588430028 L28.50551588430028 38.40501082091195 L20.020234510061712 29.91972944667338 A36 36 0 0 1 6.999999999999998 35.31288716601915 L6.999999999999998 35.31288716601915 L6.999999999999999 47.31288716601915 L-6.999999999999993 47.31288716601915 L-6.999999999999994 35.31288716601915 A36 36 0 0 1 -20.020234510061712 29.91972944667338 L-20.020234510061712 29.91972944667338 L-28.50551588430028 38.405010820911954 L-38.40501082091194 28.50551588430029 L-29.919729446673376 20.02023451006172 A36 36 0 0 1 -35.31288716601915 7 L-35.31288716601915 7 L-47.31288716601915 7.000000000000002 L-47.31288716601915 -6.999999999999989 L-35.31288716601915 -6.999999999999991 A36 36 0 0 1 -29.91972944667338 -20.02023451006171 L-29.91972944667338 -20.02023451006171 L-38.405010820911954 -28.505515884300276 L-28.505515884300294 -38.40501082091194 L-20.020234510061723 -29.919729446673372 A36 36 0 0 1 -7.000000000000002 -35.31288716601915 L-7.000000000000002 -35.31288716601915 L-7.0000000000000036 -47.31288716601915 L6.999999999999988 -47.31288716601915 L6.999999999999989 -35.31288716601915 A36 36 0 0 1 20.02023451006171 -29.91972944667338 L20.02023451006171 -29.91972944667338 L28.505515884300276 -38.405010820911954 L38.40501082091194 -28.505515884300294 L29.919729446673372 -20.020234510061723 A36 36 0 0 1 35.31288716601915 -7.000000000000004 L35.31288716601915 -7.000000000000004 L47.31288716601915 -7.000000000000007 L47.31288716601915 6.999999999999985 L35.31288716601915 6.999999999999988 A36 36 0 0 1 29.919729446673383 20.02023451006171 M0 -26A26 26 0 1 0 0 26 A26 26 0 1 0 0 -26" fill="#3c494b"></path></g></g> <g transform="translate(19 19) scale(0.6)"> <g>
<animateTransform attributeName="transform" type="rotate" values="45;0" keyTimes="0;1" dur="0.2s" begin="-0.1s" repeatCount="indefinite"></animateTransform><path d="M-29.91972944667338 -20.02023451006171 L-38.405010820911954 -28.505515884300276 L-28.505515884300294 -38.40501082091194 L-20.020234510061723 -29.919729446673372 A36 36 0 0 1 -7.000000000000002 -35.31288716601915 L-7.000000000000002 -35.31288716601915 L-7.0000000000000036 -47.31288716601915 L6.999999999999988 -47.31288716601915 L6.999999999999989 -35.31288716601915 A36 36 0 0 1 20.02023451006171 -29.91972944667338 L20.02023451006171 -29.91972944667338 L28.505515884300276 -38.405010820911954 L38.40501082091194 -28.505515884300294 L29.919729446673372 -20.020234510061723 A36 36 0 0 1 35.31288716601915 -7.000000000000004 L35.31288716601915 -7.000000000000004 L47.31288716601915 -7.000000000000007 L47.31288716601915 6.999999999999985 L35.31288716601915 6.999999999999988 A36 36 0 0 1 29.919729446673383 20.02023451006171 L29.919729446673383 20.02023451006171 L38.405010820911954 28.505515884300276 L28.505515884300298 38.40501082091194 L20.020234510061726 29.919729446673372 A36 36 0 0 1 7.000000000000007 35.31288716601915 L7.000000000000007 35.31288716601915 L7.000000000000011 47.31288716601915 L-6.999999999999981 47.31288716601915 L-6.999999999999985 35.31288716601915 A36 36 0 0 1 -20.020234510061677 29.9197294466734 L-20.020234510061677 29.9197294466734 L-28.505515884300237 38.40501082091198 L-38.40501082091191 28.505515884300337 L-29.91972944667335 20.020234510061755 A36 36 0 0 1 -35.31288716601915 7.000000000000009 L-35.31288716601915 7.000000000000009 L-47.31288716601915 7.000000000000013 L-47.31288716601915 -6.999999999999979 L-35.31288716601915 -6.999999999999983 A36 36 0 0 1 -29.919729446673365 -20.02023451006173 M0 -26A26 26 0 1 0 0 26 A26 26 0 1 0 0 -26" fill="#64b5ad"></path></g></g></g>
</svg>`
  );

  await axios("/api/train");
  element.removeAttribute("disabled");
  element.classList.toggle("cursor-not-allowed");
  document.querySelector("#train-loader").remove();
  document.querySelector("#train").insertAdjacentHTML(
    "afterbegin",
    `
	  <div class="w-full text-center mb-14">
		<span class="
		font-semibold text-4xl
		text-green-500">
		<i class="fa-solid fa-circle-check"></i>
		 Training Complete!
		</span>
	  </div>
    `
  );
}
