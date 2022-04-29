@echo off

echo:  
echo ==== VERIFYING/INSTALLING PACKAGES ====
echo:
echo =========== Installing Flask ==========
echo:
pip install flask
echo:
echo ===== Installing mysql connector ======
echo:
pip install mysql-connector-python
echo:
echo =========== Installing pyjwt ==========
echo:
pip install pyjwt
echo:
echo ========= PACKAGES INSTALLED ==========
echo:
echo ======== STARTING APPLICATION =========
echo:
python app.py
