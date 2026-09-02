import { Plus  } from 'lucide-react';

type AddButtonProps =  {
  className?: string;
  size?: number;
  Click?: () => void;
}

export default function AddButton({className, size, Click} : AddButtonProps) {
    return ( 
        <button 
        className={className}
        onClick={Click}>
            <Plus  size={size} />
        </button>
        
    )
}