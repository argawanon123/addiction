$(document).ready(function () {
  $("#addictionForm").on("submit", function (e) {
    e.preventDefault();

    const formData = {
      Experimentation: $("#experimentation").val(),
      Academic_Performance_Decline: $("#academic").val(),
      Social_Isolation: $("#isolation").val(),
      Financial_Issues: $("#financial").val(),
      Physical_Mental_Health_Problems: $("#health").val(),
      Legal_Consequences: $("#legal").val(),
      Relationship_Strain: $("#relationship").val(),
      Risk_Taking_Behavior: $("#risk").val(),
      Withdrawal_Symptoms: $("#withdrawal").val(),
      Denial_and_Resistance_to_Treatment: $("#denial").val(),
    };

    const emptyFields = Object.entries(formData).filter(
      ([key, value]) => !value || value.trim() === ""
    );

    if (emptyFields.length > 0) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    $("#submitBtn")
      .prop("disabled", true)
      .html(
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...'
      );

    $.ajax({
      url: "http://localhost:8080/api/predict",
      type: "POST",
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: function (response) {
        const prediction = response.Prediction[0];
        let resultText = "";

        for (let key in prediction) {
          resultText += `<strong>${key}</strong>: ${prediction[key]}%<br/>`;
        }

        $("#predictionResult")
          .html(resultText)
          .removeClass("d-none alert-danger")
          .addClass("alert-info");

        $("#submitBtn").prop("disabled", false).html("Submit");
      },
      error: function () {
        $("#predictionResult")
          .html("An error occurred while getting the prediction.")
          .removeClass("d-none alert-info")
          .addClass("alert-danger");

        $("#submitBtn").prop("disabled", false).html("Submit");
      },
    });
  });
});
