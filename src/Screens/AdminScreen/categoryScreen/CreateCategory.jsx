import { useContext, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { pickImageFromGallery } from "../../../utils/imagePicker";
import { uploadToImageKit } from "../../../utils/imageKitUpload";
import { HOSTED_URL } from "@env";
import CustomInputField from "../../../components/CustomInputField";
import { X, Plus } from "lucide-react-native";
import BackButton from "../../../components/BackButton";
import ImageUploadShimmer from "../../../components/Shimmer/ImageUploadShimmer";
import { CustomColor } from "../../../design/Color";
import { ThemeContext } from "../../../design/ThemeContext";
import CustomButton from "../../../components/CustomButton";
import { getAllCategory } from "../../../Redux/action/adminManage/productManage";

const initialFormState = {
    name: "",
    description: "",
    images: [],
};

const CreateCategory = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { theme } = useContext(ThemeContext);
    const { loading } = useSelector((state) => state.manage);

    const [form, setForm] = useState(initialFormState);
    const isEditMode = route?.params?.edit || false; // if editing
    const existingCategory = route?.params?.category || null; // pass category data when editing

    useEffect(() => {
        if (isEditMode && existingCategory) {
            setForm({
                name: existingCategory.name || "",
                description: existingCategory.desc || "",
                images: existingCategory.images || [],
            });
        }
    }, [isEditMode, existingCategory]);

    const handleFieldChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleDeleteImage = (index) => {
        handleFieldChange(
            "images",
            form.images.filter((_, i) => i !== index)
        );
    };

    const pickAndUpload = async () => {
        try {
            const asset = await pickImageFromGallery();
            if (!asset) return;
            const fileData = await uploadToImageKit(asset, "category", dispatch);
            const updated = [...form.images, { fileId: fileData.fileId, url: fileData.url }];
            handleFieldChange("images", updated);
        } catch (err) {
            console.error(err);
            Alert.alert("Upload Failed", "Could not upload the image. Please try again.");
        }
    };

    const handleSubmit = async () => {
        const { name } = form;
        if (!name.trim()) {
            return Alert.alert("Missing fields", "Please provide category name.");
        }

        const endpoint = isEditMode
            ? `${HOSTED_URL}/api/category/${existingCategory._id}`
            : `${HOSTED_URL}/api/category`;

        const method = isEditMode ? "PUT" : "POST";

        try {
            const resp = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    desc: form.description,
                    images: form.images,
                }),
            });

            const data = await resp.json();

            if (resp.ok) {
                dispatch(getAllCategory());
                Alert.alert(
                    "Success",
                    `Category ${isEditMode ? "updated" : "created"} successfully!`,
                    [{ text: "OK", onPress: () => navigation.goBack() }]
                );
            } else {
                console.error(data);
                Alert.alert("Error", data.message || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Error", err.message || "Network error");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <BackButton
                    color={theme.text}
                    title={isEditMode ? "Edit Category" : "Create Category"}
                />

                <KeyboardAwareScrollView contentContainerStyle={styles.content} extraScrollHeight={100}>
                    <CustomInputField
                        label="Category Name"
                        isRequired
                        value={form.name}
                        onChangeText={(text) => handleFieldChange("name", text)}
                    />

                    <CustomInputField
                        label="Description"
                        value={form.description}
                        onChangeText={(text) => handleFieldChange("description", text)}
                        multiline
                    />

                    {(form.images.length !== 0) && (
                        <Text style={[styles.label, { color: theme.text, marginTop: 16 }]}>
                            Images
                        </Text>
                    )}
                    <View style={styles.imageRow}>
                        {loading && <ImageUploadShimmer style={{ width: 120, height: 120 }} />}
                        {!loading &&
                            form.images.map((img, idx) => (
                                <View key={idx} style={styles.imageWrapper}>
                                    <Image source={{ uri: img.url }} style={styles.imageThumb} />
                                    <TouchableOpacity
                                        style={styles.deleteIcon}
                                        onPress={() => handleDeleteImage(idx)}
                                    >
                                        <X size={16} color="red" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        {!loading && (
                            <TouchableOpacity
                                style={[
                                    styles.fakeImageBox,
                                    {
                                        backgroundColor:
                                            theme.mode === "dark"
                                                ? CustomColor.GREY_90
                                                : CustomColor.GREY_20,
                                    },
                                ]}
                                onPress={pickAndUpload}
                            >
                                <Plus size={36} color={CustomColor.WHITE} />
                                <Text style={{ color: theme.text, fontSize: 12, marginTop: 4 }}>
                                    Upload
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <CustomButton
                        title={isEditMode ? "Update Category" : "Create Category"}
                        onPress={handleSubmit}
                        loading={loading}
                        color="#5A4187"
                    />
                </KeyboardAwareScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 100 },
    label: { fontSize: 16, marginBottom: 4 },
    imageRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 8 },
    imageWrapper: { position: "relative", marginBottom: 10 },
    imageThumb: { width: 120, height: 120, borderRadius: 8 },
    deleteIcon: {
        position: "absolute",
        top: 4,
        right: 4,
        backgroundColor: "rgba(255,255,255,0.7)",
        borderRadius: 8,
        padding: 2,
    },
    fakeImageBox: {
        width: 120,
        height: 120,
        borderWidth: 2,
        borderColor: "#aaa",
        borderRadius: 8,
        borderStyle: "dashed",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
});

export default CreateCategory;
