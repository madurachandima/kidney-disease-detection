const API_KEY = "http://127.0.0.1:5000/getresult";

const submit = () => {
  let age = document.getElementById("inputAge").value.trim();
  let gravity = document.getElementById("inputgravity").value.trim();
  let albumin = document.getElementById("inputAlbumin").value.trim();
  let urean = document.getElementById("inputurean").value.trim();
  let serum = document.getElementById("inputSerum").value.trim();
  let hemoglobin = document.getElementById("inputHemoglobin").value.trim();
  let blood_pressure = document
    .getElementById("inputBlood_pressure")
    .value.trim();
  let sodium = document.getElementById("inputSodium").value.trim();
  let cell_volume = document.getElementById("inputcell_volume").value.trim();

  let cell = document.getElementById("inputcell").value;
  let blood_cells = document.getElementById("inputblood_cells").value;
  let hypertension = document.getElementById("inputHypertension").value;

  let isValied = validateInput(
    age,
    gravity,
    albumin,
    urean,
    serum,
    hemoglobin,
    blood_pressure,
    sodium,
    cell_volume,

    cell,
    blood_cells,
    hypertension
  );

  if (isValied)
    getResponse(
      age,
      gravity,
      albumin,
      urean,
      serum,
      hemoglobin,
      blood_pressure,
      sodium,
      cell_volume,

      cell,
      blood_cells,
      hypertension
    );
};

const validateInput = (
  age,
  gravity,
  albumin,
  urean,
  serum,
  hemoglobin,
  blood_pressure,
  sodium,
  cell_volume,

  cell,
  blood_cells,
  hypertension
) => {
  // let numberRegex = /^[0-9]+$/;
  let numberRegex = /^(?!0\d)\d*(\.\d+)?$/;
  if (age === "") {
    tosterMessage("error", "Age is Empty.");
    return false;
  } else if (!age.match(numberRegex)) {
    tosterMessage("error", "Age is Invalid.");
    return false;
  }

  if (gravity === "") {
    tosterMessage("error", "Specific gravity is Empty.");
    return false;
  } else if (!gravity.match(numberRegex)) {
    tosterMessage("error", "Specific gravity is Invalid.");
    return false;
  }
  if (albumin === "") {
    tosterMessage("error", "Albumin is Empty.");
    return false;
  } else if (!albumin.match(numberRegex)) {
    tosterMessage("error", "Albumin is Invalid.");
    return false;
  }

  if (urean === "") {
    tosterMessage("error", "Blood urean is Empty.");
    return false;
  } else if (!urean.match(numberRegex)) {
    tosterMessage("error", "Blood urean is Invalid.");
    return false;
  }

  if (serum === "") {
    tosterMessage("error", "Serum creatinine is Empty.");
    return false;
  } else if (!serum.match(numberRegex)) {
    tosterMessage("error", "Serum creatinine is Invalid.");
    return false;
  }

  if (hemoglobin === "") {
    tosterMessage("error", "Hemoglobin is Empty.");
    return false;
  } else if (!hemoglobin.match(numberRegex)) {
    tosterMessage("error", "Hemoglobin is Invalid.");
    return false;
  }

  if (blood_pressure === "") {
    tosterMessage("error", "Blood pressure is Empty.");
    return false;
  } else if (!blood_pressure.match(numberRegex)) {
    tosterMessage("error", "Blood pressure is Invalid.");
    return false;
  }

  if (sodium === "") {
    tosterMessage("error", "Sodium is Empty.");
    return false;
  } else if (!sodium.match(numberRegex)) {
    tosterMessage("error", "Sodium is Invalid.");
    return false;
  }

  if (cell === "") {
    tosterMessage("error", "Packed cell volume is Empty.");
    return false;
  } else if (!cell.match(numberRegex)) {
    tosterMessage("error", "Packed cell volume is Invalid.");
    return false;
  }

  if (cell_volume === "9" || !cell_volume.match(numberRegex)) {
    tosterMessage("error", "Select Pus cell.");
    return false;
  }

  if (blood_cells === "9" || !blood_cells.match(numberRegex)) {
    tosterMessage("error", "Select blood cells.");
    return false;
  }

  if (hypertension === "9" || !hypertension.match(numberRegex)) {
    tosterMessage("error", "Select Hypertension.");
    return false;
  }

  return true;
};

const getResponse = (
  age,
  gravity,
  albumin,
  urean,
  serum,
  hemoglobin,
  blood_pressure,
  sodium,
  cell_volume,
  cell,
  blood_cells,
  hypertension
) => {
  let jsonObj = {
    age: age,
    specific_gravity: gravity,
    albumin: albumin,
    red_blood_cells: blood_cells,
    pus_cell: cell,
    blood_urea: urean,
    serum_creatinine: serum,
    hemoglobin: hemoglobin,
    packed_cell_volume: cell_volume,
    hypertension: hypertension,
    blood_pressure: blood_pressure,
    sodium: sodium,
  };

  callApi(jsonObj);
};

const callApi = async (jsonObj) => {
  try {
    const response = await fetch(API_KEY, {
      method: "POST",
      body: JSON.stringify(jsonObj), // string or object
      headers: {
        "Content-Type": "application/json",
      },
    });
    const reponse = await response.json(); //extract JSON from the http response

    console.log(response);
    if (reponse[0].status == 200) {
      let status = reponse[0].data["ckd_status"];

      if (status == "CKD") {
        $("#kidneyResponse").text(
          "We guess you have a kidney disease.Please meet a doctor."
        );
        document.getElementById("background_image").src =
          "../ui/assests/images/sad.png";
      } else if (status == "Not CKD") {
        $("#kidneyResponse").text("Don't worry your kidney is healthy.");
        document.getElementById("background_image").src =
          "../ui/assests/images/healthy.png";
      }
      clearInputs();
    } else if (
      reponse[0].status == 200 ||
      reponse[0].status == 406 ||
      reponse[0].status == 500
    ) {
      tosterMessage("error", "Internal Server Error");
    }
  } catch (err) {
    tosterMessage("error", "Something went to wrong, check the server stattus");
  }
};

const tosterMessage = (type, message) => {
  toastr[type](message);

  toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };
};

const clearInputs = () => {
  document.getElementById("inputAge").value = "";
  document.getElementById("inputgravity").value = "";
  document.getElementById("inputAlbumin").value = "";
  document.getElementById("inputurean").value = "";
  document.getElementById("inputSerum").value = "";
  document.getElementById("inputHemoglobin").value = "";
  document.getElementById("inputcell_volume").value = "";
  document.getElementById("inputBlood_pressure").value = "";
  document.getElementById("inputSodium").value = "";

  document.getElementById("inputcell").value = "9";
  document.getElementById("inputblood_cells").value = "9";
  document.getElementById("inputHypertension").value = "9";
};
