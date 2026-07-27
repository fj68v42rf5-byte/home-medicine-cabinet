# Curamed

Curamed is a smart, private home medicine cabinet web application designed to help individuals and families track medication quantities, monitor expiration dates, prevent duplicate purchases, and scan medicine boxes using their camera.

## What it does

* **Educational Onboarding & Private Profiles**: An interactive welcome slide carousel followed by a personal registration form. Different family members can maintain separate cabinets on the same device with complete local isolation.
* **Pill Count & Inventory Tracking**: View medication names, brands, forms, categories, and storage locations with fast `+` and `-` button quantity adjustments.
* **Live Camera Barcode Scanner**: Scan standard drug barcodes using your device camera (or enter them manually) to automatically look up and pre-fill medication details.
* **Automated Expiry Folder Segregation**: The app monitors dates and automatically routes expired drugs into a dedicated warning folder to prevent accidental consumption.
* **Smart Restock / Shopping List**: Medications that run out (quantity reaches 0) or expire are placed on a shopping list to prevent duplicate purchases at the pharmacy.

## Live link

**[https://fj68v42rf5-byte.github.io/home-medicine-cabinet/](https://fj68v42rf5-byte.github.io/home-medicine-cabinet/)**

## How to use it

1. **Get Started**: Open the live link, swipe through the onboarding slides, and enter your Name and Email to register your custom profile.
2. **Add Inventory**: Click **Add Med** (or **Scan Barcode** to use your camera) to add a drug, inputting its form, quantity, and expiration date.
3. **Manage and Restock**: Tap the profile switcher in the top right to log out or switch profiles, and check the **Restock List** or **Expired Folder** tabs to see what needs attention.

## Known limitations

* **LocalStorage Dependence**: All user cabinets and medication records are stored entirely in the browser's LocalStorage for maximum privacy. Clearing browser cookies or site data will wipe the cabinet database.
* **FDA/Open Database Match**: Camera barcode scanning queries public FDA records and pre-seeded database items. Unlisted local products or dietary supplements may require entering details manually.
