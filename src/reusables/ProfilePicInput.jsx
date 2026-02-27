import { useState, useRef, useEffect } from 'react';
import { useController } from 'react-hook-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, User, X } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePhotoField = ({ control, name = 'profilePhoto', label = 'Profile Photo', rules }) => {
  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Generate preview if value changes
  useEffect(() => {
    if (value instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result);
      };
      reader.readAsDataURL(value);
    } else if (typeof value === 'string') {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    onChange(file); // update form
  };

  const removeImage = () => {
    onChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-slate-200 font-medium">
        {label} <span className="text-red-400">*</span>
      </Label>

      <div className="flex items-center gap-4">
        {/* Avatar Preview */}
        <Avatar className="h-20 w-20 border-2 border-slate-600">
          <AvatarImage src={preview || undefined} />
          <AvatarFallback className="bg-slate-700 text-slate-300">
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>

        {/* Clickable Upload */}
        <div
          className={`
            flex-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
            hover:border-slate-500 ${error ? 'border-red-400' : 'border-slate-600'}
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-6 w-6 mx-auto mb-2 text-slate-400" />
          <p className="text-sm text-slate-300">
            Click to upload your photo
          </p>
          <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
        </div>

        {/* Remove Button */}
        {preview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={removeImage}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={(e) => {
          fileInputRef.current = e;
          ref(e);
        }}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-red-400 text-sm">{error.message}</p>}
    </div>
  );
};

export default ProfilePhotoField;
