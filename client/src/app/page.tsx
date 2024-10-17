import { ImageUploadMultipartForm } from "@/components/form/image-upload-multipart-form";
import { ImageUploadSimpleForm } from "@/components/form/image-upload-simple-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomeRoute() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Tabs defaultValue="simple" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="simple">Simple</TabsTrigger>
          <TabsTrigger value="multipart">Multipart</TabsTrigger>
        </TabsList>
        <TabsContent value="simple">
          <ImageUploadSimpleForm />
        </TabsContent>
        <TabsContent value="multipart">
          <ImageUploadMultipartForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
