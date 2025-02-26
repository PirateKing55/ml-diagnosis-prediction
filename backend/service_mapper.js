const serviceMap = {
    "81210": "cancer_prediction",           // Example: BRAF gene analysis for cancer
    "81479": "ascvd_prediction",            // Example: Unlisted molecular pathology procedure
    "93015": "cardio_prediction",           // Cardiovascular stress test
    "82947": "diabetes_prediction",         // Glucose; quantitative, blood (except reagent strip)
    "92235": "dme_prediction",              // Fluorescein angiography (includes multiframe imaging) with interpretation and report
    "93784": "hypertension_prediction",     // Ambulatory blood pressure monitoring, utilizing report-generating software
    "75557": "imaging_prediction",          // Cardiac MRI for morphology and function without contrast
    "82565": "kidney_disease_prediction",   // Creatinine; blood
    "84443": "liver_disease_prediction",    // Thyroid stimulating hormone (TSH)
    "95970": "neurology_prediction"         // Electronic analysis of implanted neurostimulator pulse generator system
};

function getServiceName(cptCode) {
    return serviceMap[cptCode] || null;
}

module.exports = getServiceName;
