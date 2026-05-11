"use client"
import { useState, useEffect } from "react"
import { Plus, X, Upload, CheckCircle2, Trash2, Edit2 } from "lucide-react"
import { createChapter, updateChapter } from "./actions"

interface ChapterFormProps {
  gradeId: string
  chapterToEdit?: any
}

interface Module {
  title: string
  videoUrl: string
  videoTitle: string
  videoDescription: string
  quizTitle: string
  quizDescription: string
  quizData: any
}

export const ChapterForm = ({ gradeId, chapterToEdit }: ChapterFormProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modules, setModules] = useState<Module[]>([])

  useEffect(() => {
    if (chapterToEdit && isOpen) {
      setModules(
        chapterToEdit.modules.map((m: any) => ({
          title: m.title || "",
          videoUrl: m.videoUrl,
          videoTitle: m.videoTitle || "",
          videoDescription: m.videoDescription || "",
          quizTitle: m.quizTitle || "",
          quizDescription: m.quizDescription || "",
          quizData: m.quizData || null,
        }))
      )
    }
  }, [chapterToEdit, isOpen])

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: "",
        videoUrl: "",
        videoTitle: "",
        videoDescription: "",
        quizTitle: "",
        quizDescription: "",
        quizData: null,
      },
    ])
  }

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index))
  }

  const updateModule = (index: number, field: keyof Module, value: any) => {
    const newModules = [...modules]
    newModules[index] = { ...newModules[index], [field]: value }
    setModules(newModules)
  }

  const handleJsonUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string)
          updateModule(index, "quizData", json)
        } catch (err) {
          alert("Invalid JSON format")
        }
      }
      reader.readAsText(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validation
    for (let i = 0; i < modules.length; i++) {
      if (!modules[i].videoUrl && !modules[i].quizData) {
        alert(`Please provide either a Video URL or Quiz JSON for Module ${i + 1}`)
        return
      }
    }

    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      if (chapterToEdit) {
        await updateChapter(chapterToEdit.id, gradeId, formData, modules)
      } else {
        await createChapter(gradeId, formData, modules)
      }
      setIsOpen(false)
      if (!chapterToEdit) {
        setModules([])
      }
    } catch (err) {
      alert(
        chapterToEdit ? "Error updating chapter" : "Error creating chapter"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {chapterToEdit ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-2.5 text-amber-500 shadow-lg shadow-amber-500/10 transition-all hover:bg-amber-500 hover:text-white font-bold"
          title="Edit Chapter"
        >
          <Edit2 className="h-4 w-4" />
          Edit Content
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-12 py-3.5 font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-500"
        >
          <Plus className="h-5 w-5" />
          Add New Chapter
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-md">
          <div className="glass-card relative my-auto w-full max-w-3xl animate-in p-6 duration-300 fade-in slide-in-from-bottom-8 md:p-10">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-7 w-7" />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold">
                {chapterToEdit ? "Edit Chapter" : "Add New Chapter"}
              </h2>
              <p className="text-muted-foreground">
                Define modules with videos and quizzes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Chapter Number
                  </label>
                  <input
                    name="chapterNo"
                    type="number"
                    required
                    defaultValue={chapterToEdit?.chapterNo}
                    placeholder="e.g. 1"
                    className="w-full rounded-2xl border border-border bg-white px-5 py-4 text-black shadow-sm transition-all outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Chapter Title
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    defaultValue={chapterToEdit?.title}
                    placeholder="e.g. Our Biosphere"
                    className="w-full rounded-2xl border border-border bg-white px-5 py-4 text-black shadow-sm transition-all outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Modules</h3>
                  <button
                    type="button"
                    onClick={addModule}
                    className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-500"
                  >
                    <Plus className="h-4 w-4" />
                    Add Module
                  </button>
                </div>

                {modules.map((module, index) => (
                  <div
                    key={index}
                    className="relative space-y-4 rounded-3xl border border-border bg-secondary/30 p-6"
                  >
                    {modules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeModule(index)}
                        className="absolute -top-2 -right-2 rounded-full bg-red-100 p-2 text-red-600 shadow-md transition-all hover:bg-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    <div className="space-y-8">
                      {/* Module Title */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                          Module Title (Optional)
                        </label>
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) =>
                            updateModule(index, "title", e.target.value)
                          }
                          placeholder={`e.g. Topic ${index + 1}`}
                          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-black outline-none focus:border-indigo-600"
                        />
                      </div>

                      {/* Video Section */}
                      <div className="space-y-4 pt-4 border-t border-border/50">
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Video Content</h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                              Video Title (Optional)
                            </label>
                            <input
                              type="text"
                              value={module.videoTitle}
                              onChange={(e) =>
                                updateModule(index, "videoTitle", e.target.value)
                              }
                              placeholder="Individual title for this video..."
                              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-black outline-none focus:border-indigo-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                              Video URL (Drive Preview) (Optional)
                            </label>
                            <input
                              type="url"
                              value={module.videoUrl}
                              onChange={(e) =>
                                updateModule(index, "videoUrl", e.target.value)
                              }
                              placeholder="https://drive.google.com/file/d/.../preview"
                              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-black outline-none focus:border-indigo-600"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            Video Description (Optional)
                          </label>
                          <textarea
                            value={module.videoDescription}
                            onChange={(e) =>
                              updateModule(index, "videoDescription", e.target.value)
                            }
                            placeholder="Brief description of this video..."
                            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-black outline-none focus:border-indigo-600 min-h-[80px]"
                          />
                          <p className="text-[10px] text-muted-foreground">Note: In google drive url replace <strong className="text-red-600">view</strong> with <strong className="text-green-600">preview</strong></p>
                        </div>
                      </div>

                      {/* Quiz Section */}
                      <div className="space-y-4 pt-4 border-t border-border/50">
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Quiz Content</h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                              Quiz Title (Optional)
                            </label>
                            <input
                              type="text"
                              value={module.quizTitle}
                              onChange={(e) =>
                                updateModule(index, "quizTitle", e.target.value)
                              }
                              placeholder="Individual title for this quiz..."
                              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-black outline-none focus:border-indigo-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                              Quiz JSON
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                accept=".json"
                                onChange={(e) => handleJsonUpload(index, e)}
                                className="hidden"
                                id={`json-upload-${index}`}
                              />
                              <label
                                htmlFor={`json-upload-${index}`}
                                className={`flex w-full cursor-pointer items-center justify-between rounded-xl border-2 border-dashed p-3 transition-all ${
                                  module.quizData
                                    ? "border-green-200 bg-green-50 text-green-600"
                                    : "border-border bg-white text-muted-foreground hover:bg-secondary"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {module.quizData ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <Upload className="h-4 w-4" />
                                  )}
                                  <span className="text-xs font-medium">
                                    {module.quizData
                                      ? `Uploaded: ${module.quizData.title}`
                                      : "Upload JSON"}
                                  </span>
                                </div>
                                {module.quizData && (
                                  <span className="text-[10px] opacity-60">
                                    {module.quizData.questions.length} Qs
                                  </span>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            Quiz Description (Optional)
                          </label>
                          <textarea
                            value={module.quizDescription}
                            onChange={(e) =>
                              updateModule(index, "quizDescription", e.target.value)
                            }
                            placeholder="Brief description of this quiz..."
                            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-black outline-none focus:border-indigo-600 min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold">STEM DIY Project</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      STEM DIY Title (Optional)
                    </label>
                    <input
                      name="stemTitle"
                      type="text"
                      defaultValue={chapterToEdit?.stemTitle}
                      placeholder="e.g. Building a Birdhouse"
                      className="w-full rounded-2xl border border-border bg-white px-5 py-4 text-black shadow-sm transition-all outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      STEM DIY Video URL (Optional)
                    </label>
                    <input
                      name="stemVideoUrl"
                      type="url"
                      defaultValue={chapterToEdit?.stemVideoUrl}
                      placeholder="Optional STEM DIY video..."
                      className="w-full rounded-2xl border border-border bg-white px-5 py-4 text-black shadow-sm transition-all outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    STEM DIY Description (Optional)
                  </label>
                  <textarea
                    name="stemDescription"
                    defaultValue={chapterToEdit?.stemDescription}
                    placeholder="Short description of the STEM project..."
                    className="w-full rounded-2xl border border-border bg-white px-5 py-4 text-black shadow-sm transition-all outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 min-h-[100px]"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Note: In google drive url replace <strong className="text-red-600">view</strong> with <strong className="text-green-600">preview</strong>. <br />
                  e.g https://drive.google.com/file/d/11Abtdhkgf8IS8xQQthTxYi5LrqpAad-4/preview
                </p>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full rounded-2xl bg-indigo-600 py-5 text-lg font-bold shadow-xl shadow-indigo-500/30 transition-all hover:bg-indigo-500 disabled:opacity-50"
              >
                {loading
                  ? chapterToEdit
                    ? "Updating..."
                    : "Creating..."
                  : chapterToEdit
                    ? "Update Chapter"
                    : "Create Chapter"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
