import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/context/LanguageContext';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export function FileUpload({ onUpload, isLoading = false }: FileUploadProps) {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const extension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(extension)) {
      setErrorMessage('Please upload a CSV or Excel file');
      setUploadStatus('error');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage('File size must be less than 10MB');
      setUploadStatus('error');
      return;
    }

    setFile(selectedFile);
    setUploadStatus('uploading');
    setErrorMessage('');

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    try {
      await onUpload(selectedFile);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          data-testid="dropzone-file-upload"
        >
          <input {...getInputProps()} data-testid="input-file" />
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop your file here' : t('dragDrop')}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('or')}
              </p>
            </div>
            <Button variant="outline" disabled={isLoading} data-testid="button-browse-files">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              {t('browseFiles')}
            </Button>
            <p className="text-xs text-muted-foreground">{t('supportedFormats')}</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            {uploadStatus !== 'uploading' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
                data-testid="button-remove-file"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {uploadStatus === 'uploading' && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {t('analyzing')} {uploadProgress}%
              </p>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="flex items-center gap-2 text-[hsl(var(--success))]">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">File processed successfully</span>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
