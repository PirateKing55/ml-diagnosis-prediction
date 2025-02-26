import React, { useState } from 'react';
import axios from 'axios';

// Service map for CPT code dropdown
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

interface FormData {
    CPT_code: string;
    age: number | '';
    frw: number | '';
    systolicBP: number | '';
    diastolicBP: number | '';
    cholesterolLevel: number | '';
    cigaretteConsumption: number | '';
    sex: 'male' | 'female' | '';
}

const MedicalPredictionForm = () => {
    const [formData, setFormData] = useState<FormData>({
        CPT_code: "81210",
        age: '',
        frw: '',
        systolicBP: '',
        diastolicBP: '',
        cholesterolLevel: '',
        cigaretteConsumption: '',
        sex: '',
    });

    const [predictionResult, setPredictionResult] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'CPT_code' || name === 'sex') {
            setFormData({
                ...formData,
                [name]: value
            });
        } else {
            // Convert numeric fields
            setFormData({
                ...formData,
                [name]: value === '' ? '' : parseFloat(value)
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate that all fields have values
        const allFieldsFilled = Object.values(formData).every(value => value !== '');

        if (!allFieldsFilled) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        try {
            // Get the API URL from environment variables
            const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api` || '/api';

            // Submit the form data
            const response = await axios.post(`${apiUrl}/predict`, formData);

            // Set the prediction result
            setPredictionResult(response.data);
        } catch (err) {
            console.error('Error submitting prediction:', err);
            setError('Failed to get prediction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Medical Prediction Form</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CPT Code */}
                    <div>
                        <label htmlFor="CPT_code" className="block text-sm font-medium text-gray-700 mb-1">
                            CPT Code (Service Type)
                        </label>
                        <select
                            id="CPT_code"
                            name="CPT_code"
                            value={formData.CPT_code}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            {Object.entries(serviceMap).map(([code, service]) => (
                                <option key={code} value={code}>
                                    {code} - {service}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sex */}
                    <div>
                        <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">
                            Sex
                        </label>
                        <select
                            id="sex"
                            name="sex"
                            value={formData.sex}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="" disabled>Select sex</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    {/* Age */}
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                            Age
                        </label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            max="120"
                            placeholder="Enter age"
                            required
                        />
                    </div>

                    {/* Framingham Risk Worsening (FRW) */}
                    <div>
                        <label htmlFor="frw" className="block text-sm font-medium text-gray-700 mb-1">
                            Framingham Risk Worsening (FRW)
                        </label>
                        <input
                            type="number"
                            id="frw"
                            name="frw"
                            value={formData.frw}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            step="0.1"
                            min="0"
                            placeholder="Enter FRW score"
                            required
                        />
                    </div>

                    {/* Systolic BP */}
                    <div>
                        <label htmlFor="systolicBP" className="block text-sm font-medium text-gray-700 mb-1">
                            Systolic BP (mmHg)
                        </label>
                        <input
                            type="number"
                            id="systolicBP"
                            name="systolicBP"
                            value={formData.systolicBP}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="60"
                            max="250"
                            placeholder="Enter systolic BP"
                            required
                        />
                    </div>

                    {/* Diastolic BP */}
                    <div>
                        <label htmlFor="diastolicBP" className="block text-sm font-medium text-gray-700 mb-1">
                            Diastolic BP (mmHg)
                        </label>
                        <input
                            type="number"
                            id="diastolicBP"
                            name="diastolicBP"
                            value={formData.diastolicBP}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="40"
                            max="150"
                            placeholder="Enter diastolic BP"
                            required
                        />
                    </div>

                    {/* Cholesterol Level */}
                    <div>
                        <label htmlFor="cholesterolLevel" className="block text-sm font-medium text-gray-700 mb-1">
                            Cholesterol Level (mg/dL)
                        </label>
                        <input
                            type="number"
                            id="cholesterolLevel"
                            name="cholesterolLevel"
                            value={formData.cholesterolLevel}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            max="500"
                            placeholder="Enter cholesterol level"
                            required
                        />
                    </div>

                    {/* Cigarette Consumption */}
                    <div>
                        <label htmlFor="cigaretteConsumption" className="block text-sm font-medium text-gray-700 mb-1">
                            Cigarette Consumption (per day)
                        </label>
                        <input
                            type="number"
                            id="cigaretteConsumption"
                            name="cigaretteConsumption"
                            value={formData.cigaretteConsumption}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            placeholder="Enter cigarettes per day"
                            required
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Generate Prediction'}
                    </button>
                </div>
            </form>

            {/* Results Section */}
            {predictionResult && (
                <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Prediction Results</h3>

                    <div className="bg-white p-4 rounded-md shadow-sm">
                        {typeof predictionResult === 'object' ? (
                            <div className="space-y-2">
                                {Object.entries(predictionResult).map(([key, value]) => (
                                    <div key={key} className="flex justify-between border-b pb-2">
                                        <span className="font-medium text-gray-700">{key.replace(/_/g, ' ').toUpperCase()}</span>
                                        <span>{typeof value === 'number' ? value.toFixed(2) : String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-700">{predictionResult}</p>
                        )}
                    </div>

                    <div className="mt-4">
                        <p className="text-sm text-gray-500">
                            Service Type: {serviceMap[formData.CPT_code as keyof typeof serviceMap]} (CPT: {formData.CPT_code})
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalPredictionForm;