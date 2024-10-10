import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Settings, Upload, FileUp, Plus, Trash2, PenLine } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface JobDescription {
  id: string;
  company: string;
  position: string;
  description: string;
}

function App() {
  const [resume, setResume] = useState('');
  const [resumeLastUpdated, setResumeLastUpdated] = useState<Date | null>(null);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [selectedJdId, setSelectedJdId] = useState<string | null>(null);
  const [tailoredResume, setTailoredResume] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleResumeUpload = () => {
    // This would typically involve file upload. For now, we'll just update the timestamp.
    setResumeLastUpdated(new Date());
  };

  const handleAddJd = (company: string, position: string, description: string) => {
    if (jobDescriptions.length < 3) {
      const newJd: JobDescription = {
        id: Date.now().toString(),
        company,
        position,
        description
      };
      setJobDescriptions([...jobDescriptions, newJd]);
    }
  };

  const handleRemoveJd = (id: string) => {
    setJobDescriptions(jobDescriptions.filter(jd => jd.id !== id));
    if (selectedJdId === id) {
      setSelectedJdId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJdId) return;
    setIsLoading(true);
    // TODO: Implement API call to ChatGPT here
    // For now, we'll just simulate a delay
    setTimeout(() => {
      const selectedJd = jobDescriptions.find(jd => jd.id === selectedJdId);
      setTailoredResume(`이력서가 ${selectedJd?.company}의 ${selectedJd?.position} 포지션에 맞게 수정되었습니다. (실제 API 연동 필요)`);
      setIsLoading(false);
    }, 2000);
  };

  const handleApiKeySave = () => {
    // TODO: Implement proper API key storage (e.g., in secure storage)
    console.log('API Key saved:', apiKey);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center mb-6">
            <PenLine className="h-8 w-8 mr-2" />
            <h1 className="text-3xl font-bold">AI Resume</h1>
          </div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>My Resume</CardTitle>
              <CardDescription>Upload or edit your current resume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Button onClick={handleResumeUpload}>
                  <Upload className="mr-2 h-4 w-4" /> Upload Resume
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <FileUp className="mr-2 h-4 w-4" /> Edit Resume
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Your Resume</DialogTitle>
                      <DialogDescription>
                        Make changes to your resume here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      value={resume}
                      onChange={(e) => setResume(e.target.value)}
                      className="min-h-[300px]"
                    />
                    <DialogFooter>
                      <Button onClick={() => {
                        setResumeLastUpdated(new Date());
                        // Close dialog logic here
                      }}>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {resumeLastUpdated && (
                <p className="text-sm text-gray-500">
                  Last updated: {resumeLastUpdated.toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Job Descriptions</CardTitle>
              <CardDescription>Add up to 3 job descriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedJdId || ''} onValueChange={setSelectedJdId}>
                {jobDescriptions.map((jd) => (
                  <div key={jd.id} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={jd.id} id={jd.id} />
                    <Label htmlFor={jd.id}>{jd.company} - {jd.position}</Label>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveJd(jd.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </RadioGroup>
              {jobDescriptions.length < 3 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" /> Add Job Description
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Job Description</DialogTitle>
                      <DialogDescription>
                        Enter the details of the job you're applying for.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      handleAddJd(
                        formData.get('company') as string,
                        formData.get('position') as string,
                        formData.get('description') as string
                      );
                      // Close dialog logic here
                    }}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="company" className="text-right">Company</Label>
                          <Input id="company" name="company" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="position" className="text-right">Position</Label>
                          <Input id="position" name="position" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">Description</Label>
                          <Textarea id="description" name="description" className="col-span-3" required />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add Job Description</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
          <div className="mt-6 text-center">
            <Button onClick={handleSubmit} disabled={isLoading || !selectedJdId}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                'Rewrite with AI'
              )}
            </Button>
          </div>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {tailoredResume
                  ? `My Resume for ${jobDescriptions.find(jd => jd.id === selectedJdId)?.company}`
                  : 'Tailored Resume'}
              </CardTitle>
              <CardDescription>Your AI-tailored resume will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              {tailoredResume ? (
                <Textarea
                  value={tailoredResume}
                  readOnly
                  className="h-[calc(100vh-300px)]"
                />
              ) : (
                <div className="flex items-center justify-center h-[calc(100vh-300px)] text-gray-400">
                  이력서를 생성해보세요
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="fixed bottom-4 right-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>API 키 설정</DialogTitle>
              <DialogDescription>
                ChatGPT API 키를 입력하세요. 이 키는 로컬에 저장됩니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="api-key" className="text-right">
                  API 키
                </Label>
                <Input
                  id="api-key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleApiKeySave}>저장</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default App;