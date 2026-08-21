import cv2
import mediapipe as mp

from app.ai.yolo_detector import detect_palm
from app.utils.image_processing import preprocess_image
from app.ai.feature_extractor import extract_features
from app.ai.finger_analyzer import analyze_fingers
from app.ai.line_detector import detect_palm_lines
from app.ai.line_classifier import classify_lines
from app.ai.palm_classifier import classify_palm
from app.ai.interpretation_engine import generate_interpretation
from app.ai.life_trend_engine import generate_life_trends
from app.ai.recommendation_engine import generate_recommendations


# ============================================================
# MediaPipe configuration
# ============================================================

BaseOptions = mp.tasks.BaseOptions
HandLandmarker = mp.tasks.vision.HandLandmarker
HandLandmarkerOptions = mp.tasks.vision.HandLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode


MODEL_PATH = "app/models/hand_landmarker.task"


# ============================================================
# Main Palm Processing Function
# ============================================================

def process_palm(image_path):

    print("\n")
    print("==============================================")
    print("          PALM ANALYSIS STARTED")
    print("==============================================")
    print("Image path:", image_path)

    # --------------------------------------------------------
    # STEP 1 — YOLO Palm Detection
    # --------------------------------------------------------

    print("\n[STEP 1] Starting YOLO palm detection...")

    detect_palm(image_path)

    print("[STEP 1] YOLO palm detection completed.")

    # --------------------------------------------------------
    # STEP 2 — Read Original Image
    # --------------------------------------------------------

    print("\n[STEP 2] Reading original image...")

    original = cv2.imread(image_path)

    if original is None:
        raise Exception(
            "Unable to read uploaded image."
        )

    print(
        "[STEP 2] Image loaded successfully."
    )

    print(
        "[STEP 2] Image shape:",
        original.shape
    )

    # --------------------------------------------------------
    # STEP 3 — Preprocess Image
    # --------------------------------------------------------

    print("\n[STEP 3] Preprocessing image...")

    image = preprocess_image(original)

    if image is None:
        raise Exception(
            "Image preprocessing returned None."
        )

    print(
        "[STEP 3] Image preprocessing completed."
    )

    print(
        "[STEP 3] Processed image shape:",
        image.shape
    )

    # --------------------------------------------------------
    # STEP 4 — Convert Image for MediaPipe
    # --------------------------------------------------------

    print(
        "\n[STEP 4] Creating MediaPipe image..."
    )

    mp_image = mp.Image(
        image_format=mp.ImageFormat.SRGB,
        data=image
    )

    print(
        "[STEP 4] MediaPipe image created."
    )

    # --------------------------------------------------------
    # STEP 5 — Initialize MediaPipe Hand Landmarker
    # --------------------------------------------------------

    print(
        "\n[STEP 5] Loading MediaPipe Hand Landmarker..."
    )

    print(
        "[STEP 5] Model path:",
        MODEL_PATH
    )

    options = HandLandmarkerOptions(
        base_options=BaseOptions(
            model_asset_path=MODEL_PATH
        ),
        running_mode=VisionRunningMode.IMAGE,
        num_hands=1
    )

    print(
        "[STEP 5] MediaPipe options created."
    )

    # --------------------------------------------------------
    # STEP 6 — Detect Hand Landmarks
    # --------------------------------------------------------

    print(
        "\n[STEP 6] Starting MediaPipe hand detection..."
    )

    with HandLandmarker.create_from_options(
        options
    ) as landmarker:

        print(
            "[STEP 6] MediaPipe model loaded."
        )

        result = landmarker.detect(
            mp_image
        )

    print(
        "[STEP 6] MediaPipe detection completed."
    )

    # --------------------------------------------------------
    # Check landmarks
    # --------------------------------------------------------

    print(
        "[STEP 6] Number of hands detected:",
        len(result.hand_landmarks)
    )

    if len(result.hand_landmarks) == 0:

        raise Exception(
            "No hand landmarks detected."
        )

    hand = result.hand_landmarks[0]

    print(
        "[STEP 6] Hand landmarks detected:",
        len(hand)
    )

    # --------------------------------------------------------
    # STEP 7 — Convert Landmarks
    # --------------------------------------------------------

    print(
        "\n[STEP 7] Converting landmarks..."
    )

    h, w, _ = image.shape

    landmark_data = []

    for lm in hand:

        landmark_data.append(
            {
                "x": lm.x * w,
                "y": lm.y * h,
                "z": lm.z
            }
        )

    print(
        "[STEP 7] Landmark conversion completed."
    )

    print(
        "[STEP 7] Number of landmarks:",
        len(landmark_data)
    )

    # --------------------------------------------------------
    # STEP 8 — Draw Landmarks
    # --------------------------------------------------------

    print(
        "\n[STEP 8] Drawing landmarks..."
    )

    processed = cv2.cvtColor(
        image,
        cv2.COLOR_RGB2BGR
    )

    for lm in landmark_data:

        cv2.circle(
            processed,
            (
                int(lm["x"]),
                int(lm["y"])
            ),
            4,
            (0, 255, 0),
            -1
        )

    print(
        "[STEP 8] Landmarks drawn successfully."
    )

    # --------------------------------------------------------
    # STEP 9 — Feature Extraction
    # --------------------------------------------------------

    print(
        "\n[STEP 9] Extracting palm features..."
    )

    features = extract_features(
        landmark_data
    )

    print(
        "[STEP 9] Feature extraction completed."
    )

    print(
        "[STEP 9] Features:",
        features
    )

    # --------------------------------------------------------
    # STEP 10 — Palm Classification
    # --------------------------------------------------------

    print(
        "\n[STEP 10] Classifying palm..."
    )

    classification = classify_palm(
        features
    )

    print(
        "[STEP 10] Palm classification completed."
    )

    print(
        "[STEP 10] Classification:",
        classification
    )

    # --------------------------------------------------------
    # STEP 11 — Finger Analysis
    # --------------------------------------------------------

    print(
        "\n[STEP 11] Analyzing fingers..."
    )

    finger_analysis = analyze_fingers(
        landmark_data
    )

    print(
        "[STEP 11] Finger analysis completed."
    )

    print(
        "[STEP 11] Finger analysis:",
        finger_analysis
    )

    # --------------------------------------------------------
    # STEP 12 — Detect Palm Lines
    # --------------------------------------------------------

    print(
        "\n[STEP 12] Detecting palm lines..."
    )

    line_image = detect_palm_lines(
        processed
    )

    print(
        "[STEP 12] Palm line detection completed."
    )

    # --------------------------------------------------------
    # STEP 13 — Classify Palm Lines
    # --------------------------------------------------------

    print(
        "\n[STEP 13] Classifying palm lines..."
    )

    line_analysis = classify_lines(
        line_image,
        landmark_data
    )

    print(
        "[STEP 13] Palm line classification completed."
    )

    print(
        "[STEP 13] Line analysis:",
        line_analysis
    )

    # --------------------------------------------------------
    # STEP 14 — Generate AI Interpretation
    # --------------------------------------------------------

    print(
        "\n[STEP 14] Generating AI palm interpretation..."
    )

    interpretation = generate_interpretation(
        classification,
        finger_analysis,
        line_analysis
    )

    print(
        "[STEP 14] AI interpretation completed."
    )

    print(
        "[STEP 14] Interpretation:",
        interpretation
    )

    # --------------------------------------------------------
    # STEP 15 — Generate Recommendations
    # --------------------------------------------------------

    print(
        "\n[STEP 15] Generating recommendations..."
    )

    recommendations = generate_recommendations(
        classification,
        finger_analysis,
        line_analysis
    )

    print(
        "[STEP 15] Recommendations generated."
    )

    # --------------------------------------------------------
    # STEP 16 — Generate Life Trends
    # --------------------------------------------------------

    print(
        "\n[STEP 16] Generating life trends..."
    )

    life_trends = generate_life_trends(
        classification,
        line_analysis
    )

    print(
        "[STEP 16] Life trends generated."
    )

    # --------------------------------------------------------
    # FINAL
    # --------------------------------------------------------

    print("\n")
    print("==============================================")
    print("          PALM ANALYSIS COMPLETED")
    print("==============================================")
    print(
        "Landmarks:",
        len(landmark_data)
    )
    print(
        "Features:",
        features
    )
    print(
        "Classification:",
        classification
    )
    print(
        "Finger Analysis:",
        finger_analysis
    )
    print(
        "Line Analysis:",
        line_analysis
    )
    print("==============================================")

    return (
        processed,
        line_image,
        landmark_data,
        features,
        classification,
        finger_analysis,
        line_analysis,
        interpretation,
        recommendations,
        life_trends
    )