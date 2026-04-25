import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";
import Button from "@/components/Button";
import { defaultpizzaimage } from "@/components/ProductListItem";
import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";
import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native";
const CreatProductScreen = () => {
  const [name, setname] = useState("");
  const [price, setprice] = useState("");
  const [error, seterror] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0],
  );
  const isUpdating = !!id;

  const { mutate: insertproduct, isPending: isInserting } = useInsertProduct();
  const { mutate: updateproduct, isPending: isUpdate } = useUpdateProduct();
  const { mutate: deleteproduct } = useDeleteProduct();
  const { data: updatingproduct } = useProduct(id);
  const router = useRouter();

  const isPending = isInserting || isUpdate;

  useEffect(() => {
    if (updatingproduct) {
      setname(updatingproduct.name);
      setprice(updatingproduct.price.toString());
      setImage(updatingproduct.image);
    }
  }, [updatingproduct]);

  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  };

  const resetFields = () => {
    setname("");
    setprice("");
  };

  const validateinput = () => {
    seterror("");
    if (!name) {
      seterror("Name is required");
      return false;
    }
    if (!price) {
      seterror("Price is required");
      return false;
    }
    if (isNaN(parseFloat(price))) {
      seterror("Price is not a number");
      return false;
    }
    return true;
  };
  const onCreate = async () => {
    if (!validateinput()) {
      return;
    }
    const imagePathe = await uploadImage();
    insertproduct(
      { name, price: parseFloat(price), image: imagePathe },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      },
    );
  };
  const onUpdate = async () => {
    if (!validateinput()) {
      return;
    }
    const imagePathe = await uploadImage();

    updateproduct(
      { id, name, price: parseFloat(price), image: imagePathe },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      },
    );
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const onDelete = () => {
    deleteproduct(id, {
      onSuccess: () => {
        resetFields();
        router.replace("/(admin)");
      },
    });
  };

  const confirmdelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onDelete },
    ]);
  };

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) return;
    const file = new File(image);
    const base64 = await file.base64();
    const filePath = `${randomUUID()}.png`;
    const { data, error } = await supabase.storage
      .from("product-image")
      .upload(filePath, decode(base64), {
        contentType: "image/png",
      });

    if (error) throw error;

    return data.path;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? "Update Product" : "Create Product" }}
      />
      <Image
        style={styles.image}
        source={{ uri: image || defaultpizzaimage }}
      />
      <Text onPress={pickImage} style={styles.textButton}>
        Select Image
      </Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setname}
        placeholder="Name"
        style={styles.input}
      />
      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        value={price}
        onChangeText={setprice}
        placeholder="9.99"
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={{ color: "red" }}>{error}</Text>
      <Button
        disabled={isPending}
        onPress={onSubmit}
        text={
          isPending
            ? isUpdating
              ? "Updating..."
              : "Creating..."
            : isUpdating
              ? "Update"
              : "Create"
        }
      />
      {isUpdating && (
        <Text onPress={confirmdelete} style={styles.textButton}>
          Delete
        </Text>
      )}
    </View>
  );
};

export default CreatProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    color: "gray",
    fontSize: 16,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
});
