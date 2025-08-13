import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '@/integrations/supabase/client';
import './RichTextEditor.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  className = ""
}) => {
  const quillRef = useRef<ReactQuill>(null);
  // Custom image handler for React Quill
  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          // Get current cursor position
          const quill = quillRef.current?.getEditor();
          if (!quill) return;
          
          const range = quill.getSelection();
          const insertIndex = range ? range.index : 0;
          
          // Show loading state
          quill.insertText(insertIndex, 'Uploading image...', 'user');
          
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `blog-images/${fileName}`;

          // Upload to the blog-images bucket
          const { error: uploadError } = await supabase.storage
            .from('blog-images')
            .upload(filePath, file);

          if (uploadError) {
            // Fallback to avatars bucket
            if (uploadError.message.includes('bucket')) {
              const { error: fallbackError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);
              
              if (fallbackError) throw fallbackError;
              
              const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

              // Remove loading text and insert image
              quill.deleteText(insertIndex, 18); // Remove "Uploading image..."
              quill.insertEmbed(insertIndex, 'image', publicUrl);
              
              // Set cursor position after the image
              quill.setSelection(insertIndex + 1, 0);
              console.log('Image uploaded and inserted successfully!');
            } else {
              throw uploadError;
            }
          } else {
            // Success with blog-images bucket
            const { data: { publicUrl } } = supabase.storage
              .from('blog-images')
              .getPublicUrl(filePath);

            // Remove loading text and insert image
            quill.deleteText(insertIndex, 18); // Remove "Uploading image..."
            quill.insertEmbed(insertIndex, 'image', publicUrl);
            
            // Set cursor position after the image
            quill.setSelection(insertIndex + 1, 0);
            console.log('Image uploaded and inserted successfully!');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image. Please try again.');
          
          // Remove loading text on error
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection();
            const insertIndex = range ? range.index : 0;
            // Try to remove loading text safely
            try {
              quill.deleteText(insertIndex, 18);
            } catch (deleteError) {
              console.log('Could not remove loading text, continuing...');
            }
          }
        }
      }
    };
  };

  // Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false
    }
  }), []);

  // Quill formats configuration
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image',
    'clean'
  ];

  // Add click handler for image deletion
  React.useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLImageElement;
      if (target.tagName === 'IMG') {
        // Check if the click is on the delete button area
        const rect = target.getBoundingClientRect();
        const clickX = (e as MouseEvent).clientX;
        const clickY = (e as MouseEvent).clientY;
        
        // Check if click is in the top-right corner (delete button area)
        const isDeleteClick = 
          clickX > rect.right - 30 && 
          clickX < rect.right + 5 && 
          clickY > rect.top - 5 && 
          clickY < rect.top + 30;
        
        if (isDeleteClick) {
          e.preventDefault();
          e.stopPropagation();
          
          // Find the image index in the editor
          const images = quill.getContents().ops || [];
          let imageIndex = -1;
          let currentIndex = 0;
          
          for (let i = 0; i < images.length; i++) {
            const op = images[i];
            if (op.insert && typeof op.insert === 'object' && op.insert.image) {
              if (target.src === op.insert.image) {
                imageIndex = currentIndex;
                break;
              }
            }
            currentIndex += typeof op.insert === 'string' ? op.insert.length : 1;
          }
          
          if (imageIndex !== -1) {
            // Remove the image
            quill.deleteText(imageIndex, 1);
            console.log('Image deleted successfully!');
          }
        }
      }
    };

    // Add click event listener to the editor
    const editorElement = quill.root;
    editorElement.addEventListener('click', handleImageClick);

    return () => {
      editorElement.removeEventListener('click', handleImageClick);
    };
  }, []);

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: '300px' }}
      />
    </div>
  );
};

export default RichTextEditor; 