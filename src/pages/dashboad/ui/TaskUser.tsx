import { useState, useEffect } from 'react';
import { Plus, Trash2, ImageIcon, Circle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';

type TaskType = {
    id: string;
    title: string;
    isCompleted: boolean;
}

const MOCK_BACKGROUNDS = [
    { name: 'Montanas', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80' },
    { name: 'Playa', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80' },
    { name: 'Bosque', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80' },
    { name: 'Ciudad nocturna', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&q=80' },
    { name: 'Desierto', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80' },
    { name: 'Aurora boreal', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80' },
];

export default function TaskUser() {

    const [allTask, setAllTask] = useState<Array<TaskType>>(() => {
        const saved = localStorage.getItem('task');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('task', JSON.stringify(allTask));
    }, [allTask]);

    const [taskInput, setTaskInput] = useState('');

    const addTask = () => {
        if (taskInput.trim() === '') return;

        const newTask: TaskType = {
            id: Date.now().toString(),
            title: taskInput,
            isCompleted: false,
        };

        setAllTask([...allTask, newTask]);
        setTaskInput('');
    }

    const deleteTask = (taskId: string) => {
        setAllTask(allTask.filter((task) => task.id !== taskId));
    }

    const [bgImage, setBgImage] = useState(() => {
        return localStorage.getItem('bg-image') || MOCK_BACKGROUNDS[0].url;
    });
    const [customUrl, setCustomUrl] = useState('');

    useEffect(() => {
        localStorage.setItem('bg-image', bgImage);
    }, [bgImage]);

    const today = new Date();
    const dateStr = today.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return (
        <div className="relative flex flex-col h-screen overflow-hidden">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${bgImage})` }}
            />
            <div className="absolute inset-0 bg-black/30" />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">

                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-0">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Mi dia</h1>
                        <p className="text-sm text-white/70 capitalize">{dateStr}</p>
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Background picker */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                                    <ImageIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Fondo</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {MOCK_BACKGROUNDS.map((bg) => (
                                    <DropdownMenuItem key={bg.url} onClick={() => setBgImage(bg.url)}>
                                        {bg.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Custom URL sheet */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 text-xs font-bold">
                                    URL
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Fondo personalizado</SheetTitle>
                                    <SheetDescription>
                                        Pega la URL de una imagen para usarla como fondo.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="flex flex-col gap-4 p-4">
                                    <div className="flex flex-col gap-2">
                                        <Label>URL de imagen</Label>
                                        <Input
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                            value={customUrl}
                                            onChange={(e) => setCustomUrl(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        onClick={() => {
                                            if (customUrl.trim()) {
                                                setBgImage(customUrl.trim());
                                                setCustomUrl('');
                                            }
                                        }}
                                    >
                                        Aplicar fondo
                                    </Button>
                                    {bgImage && (
                                        <div className="rounded-md overflow-hidden border">
                                            <img
                                                src={bgImage}
                                                alt="Fondo actual"
                                                className="w-full h-32 object-cover"
                                            />
                                            <p className="text-xs text-muted-foreground p-2 truncate">{bgImage}</p>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Task list - scrollable area */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {allTask.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 text-center max-w-sm">
                                <div className="text-5xl mb-4">📋</div>
                                <h2 className="text-xl font-semibold text-white mb-2">Concentrate en tu dia</h2>
                                <p className="text-sm text-white/70">
                                    Termina tus tareas con Mi dia, una lista que se actualiza todos los dias.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-0.5">
                            {allTask.map((task) => (
                                <div key={task.id}>
                                    <div className="group flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-white/10 transition-colors">
                                        <Circle className="size-5 text-white/70 shrink-0" />
                                        <span className="flex-1 text-sm text-white truncate">
                                            {task.title}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            className="opacity-0 group-hover:opacity-100 text-white/70 hover:text-red-400 hover:bg-white/10 transition-opacity"
                                            onClick={() => deleteTask(task.id)}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom input bar */}
                <div className="p-4">
                    <form
                        className="flex items-center gap-3 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 px-4 py-2 shadow-lg"
                        onSubmit={(e) => { e.preventDefault(); addTask(); }}
                    >
                        <Plus className="size-5 text-white/70 shrink-0" />
                        <input
                            type="text"
                            placeholder="Agregar una tarea"
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/50"
                        />
                        {taskInput.trim() && (
                            <Button type="submit" size="sm" variant="ghost" className="text-white hover:bg-white/10">
                                Agregar
                            </Button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}
