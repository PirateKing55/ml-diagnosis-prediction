import pandas as pd
import numpy as np
import pickle
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import RandomizedSearchCV
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import VotingClassifier
from imblearn.pipeline import Pipeline 
from sklearn.metrics import accuracy_score, classification_report

class ModelSurveyorCancer:
    def __init__(self):
        # URLs for the datasets (replace with Cancer-specific URLs if available)
        self.X_train_url = "https://github.com/UBC-MDS/CardioPredict/raw/main/data/processed/X_train_transformed.csv"
        self.y_train_url = "https://github.com/UBC-MDS/CardioPredict/raw/main/data/processed/y_train.csv"
        self.X_test_url = "https://github.com/UBC-MDS/CardioPredict/raw/main/data/processed/X_test_transformed.csv"
        self.y_test_url = "https://github.com/UBC-MDS/CardioPredict/raw/main/data/processed/y_test.csv"
        
        # Output model path for Cancer
        self.model_path = "CancerPredict.pkl"
    
    def load_data(self):
        """Loads training and testing datasets."""
        try:
            self.X_train = pd.read_csv(self.X_train_url)
            self.y_train = pd.read_csv(self.y_train_url).values.ravel()
            self.X_test = pd.read_csv(self.X_test_url)
            self.y_test = pd.read_csv(self.y_test_url).values.ravel()
            print("Data loaded successfully!")
        except Exception as e:
            print("Error loading data:", e)
    
    def initialize_knn(self, n_neighbors=5):
        """Initializes a K-Nearest Neighbors classifier."""
        self.knn_model = KNeighborsClassifier(n_neighbors=n_neighbors)
        return self.knn_model
    
    def tune_logistic_regression(self):
        """Performs hyperparameter tuning for Logistic Regression."""
        param_grid = {
            'C': np.logspace(-4, 4, 20),
            'solver': ['liblinear', 'lbfgs']
        }
        model = LogisticRegression()
        self.lr_tuned = RandomizedSearchCV(model, param_grid, cv=5, n_iter=10, n_jobs=-1, random_state=42)
        self.lr_tuned.fit(self.X_train, self.y_train)
        print("Best parameters for Logistic Regression:", self.lr_tuned.best_params_)
        return self.lr_tuned.best_estimator_
    
    def train_mlp(self):
        """Trains a Multi-Layer Perceptron classifier."""
        self.mlp_model = MLPClassifier(hidden_layer_sizes=(50, 50), max_iter=1000, random_state=42)
        self.mlp_model.fit(self.X_train, self.y_train)
        print("MLP Model trained.")
        return self.mlp_model
    
    def create_ensemble(self):
        """Creates an ensemble model using VotingClassifier."""
        knn = self.initialize_knn()
        lr = self.tune_logistic_regression()
        mlp = self.train_mlp()
        
        self.ensemble_model = VotingClassifier(estimators=[
            ('knn', knn),
            ('log_reg', lr),
            ('mlp', mlp)
        ], voting='hard')
        self.ensemble_model.fit(self.X_train, self.y_train)
        print("Ensemble model created and trained.")
        return self.ensemble_model
    
    def save_model(self):
        """Saves the trained ensemble model to a file."""
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.ensemble_model, f)
        print("Model saved successfully as", self.model_path)
    
    def load_and_test_model(self):
        """Loads the trained model and evaluates it on test data."""
        try:
            with open(self.model_path, 'rb') as f:
                loaded_model = pickle.load(f)
            y_pred = loaded_model.predict(self.X_test)
            print("Model Accuracy:", accuracy_score(self.y_test, y_pred))
            print("Classification Report:\n", classification_report(self.y_test, y_pred))
        except Exception as e:
            print("Error loading or testing model:", e)
    
if __name__ == "__main__":
    surveyor = ModelSurveyorCancer()
    surveyor.load_data()
    best_lr_model = surveyor.tune_logistic_regression()
    mlp_model = surveyor.train_mlp()
    ensemble_model = surveyor.create_ensemble()
    surveyor.save_model()
    surveyor.load_and_test_model()
    print("Cancer model trained and tested successfully.")
