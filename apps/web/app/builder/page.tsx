"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StepsList } from "@/components/StepsList";
import { FileExplorer } from "@/components/FileExplorer";
import { TabView } from "@/components/TabView";
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewFrame } from "@/components/PreviewFrame";
import { Step, FileItem, StepType } from "@/lib/types";
import axios from "axios";
import { parseXml } from "@/lib/steps-util";
import { useWebContainer } from "@/hooks/useWebcontainer";
import { Loader } from "@/components/Loader";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";

export default function Builder() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get("prompt"); // Extract prompt from query params

  const { theme } = useTheme(); // Get the current theme (light or dark)
  const isDarkMode = theme === "dark"; // Determine if dark mode is active

  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();
  const { status } = useSession(); // Get session status
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  // Redirect user to login page if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login"); // Redirect if not authenticated
    }
  }, [status, router]);

  useEffect(() => {
    if (!prompt) return;

    const updateFileStructure = () => {
      let originalFiles = [...files];
      let updateHappened = false;

      steps
        .filter(({ status }) => status === "pending")
        .forEach((step) => {
          updateHappened = true;
          if (step?.type === StepType.CreateFile) {
            let parsedPath = step.path?.split("/") ?? [];
            let currentFileStructure = [...originalFiles];
            let finalAnswerRef = currentFileStructure;
            let currentFolder = "";

            while (parsedPath.length) {
              currentFolder = `${currentFolder}/${parsedPath[0]}`;
              let currentFolderName = parsedPath[0];
              parsedPath = parsedPath.slice(1);

              if (!parsedPath.length) {
                let file = currentFileStructure.find(
                  (x) => x.path === currentFolder
                );
                if (!file) {
                  currentFileStructure.push({
                    name: currentFolderName,
                    type: "file",
                    path: currentFolder,
                    content: step.code,
                  });
                } else {
                  file.content = step.code;
                }
              } else {
                let folder = currentFileStructure.find(
                  (x) => x.path === currentFolder
                );
                if (!folder) {
                  currentFileStructure.push({
                    name: currentFolderName,
                    type: "folder",
                    path: currentFolder,
                    children: [],
                  });
                }
                currentFileStructure = currentFileStructure.find(
                  (x) => x.path === currentFolder
                )!.children!;
              }
            }
            originalFiles = finalAnswerRef;
          }
        });

      if (updateHappened) {
        setFiles(originalFiles);
        setSteps((prevSteps) =>
          prevSteps.map((s) => ({ ...s, status: "completed" }))
        );
      }
    };

    updateFileStructure();
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileItem, isRootFolder: boolean) => {
        if (file.type === "folder") {
          mountStructure[file.name] = {
            directory: file.children
              ? Object.fromEntries(
                  file.children.map((child) => [child.name, processFile(child, false)])
                )
              : {},
          };
        } else if (file.type === "file") {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || "",
              },
            };
          } else {
            return {
              file: {
                contents: file.content || "",
              },
            };
          }
        }
        return mountStructure[file.name];
      };

      files.forEach((file) => processFile(file, true));
      return mountStructure;
    };

    const mountStructure = createMountStructure(files);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    if (!prompt) return;

    const response = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/ai/template`, {
      prompt: prompt.trim(),
    });
    setTemplateSet(true);

    const { prompts, uiPrompts } = response.data;

    setSteps(
      parseXml(uiPrompts[0]).map((x: Step) => ({
        ...x,
        status: "pending",
      }))
    );

    setLoading(true);
    const stepsResponse = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/ai/chat`, {
      messages: [...prompts, prompt].map((content) => ({
        role: "user",
        content,
      })),
    });

    setLoading(false);

    setSteps((prevSteps) => [
      ...prevSteps,
      ...parseXml(stepsResponse.data.response).map((x) => ({
        ...x,
        status: "pending",
      })),
    ]);

    setLlmMessages([
      ...prompts.map((content) => ({ role: "user", content })),
      { role: "user", content: prompt },
      { role: "assistant", content: stepsResponse.data.response },
    ]);
  }

  useEffect(() => {
    init();
  }, [prompt]);

  if (!prompt) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No prompt provided. Please provide a valid prompt.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col px-5">
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-4 gap-6 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-1 space-y-6 overflow-auto"
          >
            <StepsList
              steps={steps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
            />
            <div className="flex">
              {loading && <Loader />}
              {!loading && (
                <div className="flex space-x-2">
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="p-2 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    onClick={async () => {
                      const newMessage = { role: "user", content: userPrompt };
                      setLoading(true);
                      const stepsResponse = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/ai/chat`, {
                        messages: [...llmMessages, newMessage],
                      });
                      setLoading(false);

                      setLlmMessages((prev) => [...prev, newMessage]);
                      setLlmMessages((prev) => [
                        ...prev,
                        { role: "assistant", content: stepsResponse.data.response },
                      ]);

                      setSteps((prevSteps) => [
                        ...prevSteps,
                        ...parseXml(stepsResponse.data.response).map((x) => ({
                          ...x,
                          status: "pending",
                        })),
                      ]);
                    }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 rounded-lg transition-colors"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </motion.div>
          <div className="col-span-1">
            <FileExplorer files={files} onFileSelect={setSelectedFile} />
          </div>
          <div className="col-span-2 rounded-lg p-4 bg-gradient-to-b from-background to-secondary">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-4rem)]">
              {activeTab === "code" ? (
                <CodeEditor file={selectedFile} isDarkMode={isDarkMode} />
              ) : (
                <PreviewFrame webContainer={webcontainer} files={files} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}