import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { ToastAction } from "../ui/toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// import * as dialog from "@/components/ui/dialog";
import useAxioAuth from "@/hooks/useAxioAuth";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { CiEdit } from "react-icons/ci";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please input your Tournament Name.",
  }),
  startDate: z.date({
    required_error: "A start date is required.",
  }),
  location: z.string().min(1, {
    message: "Please input your location.",
  }),
  minEloRating: z.string().min(1, {
    message: "Please input your minimum elo rating.",
  }),
  maxEloRating: z.string().min(1, {
    message: "Please input your maximum elo rating.",
  }),
  description: z.string(),
});

interface MyComponentProps {
  data: any;
  onRefresh: () => void; // Add this prop to type definition
}

const TournamentUpdateForm: React.FC<MyComponentProps> = ({
  data,
  onRefresh,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosAuth = useAxioAuth();
  const [tournament, setTournament] = useState<any>();

  useEffect(() => {
    if (data) {
      setTournament(data);
      form.reset({
        name: data.name,
        location: data.location,
        minEloRating: String(data.minEloRating),
        maxEloRating: String(data.maxEloRating),
        // description: data.description,
      });
    }
  }, [data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const result = await axiosAuth.put(
        "/api/tournament/" + tournament.id,
        {
          name: values.name,
          startDate: values.startDate,
          location: values.location,
          minEloRating: parseInt(values.minEloRating),
          maxEloRating: parseInt(values.maxEloRating),
          description: values.description,
          format: tournament.format,
        },
        { withCredentials: true }
      );

      onRefresh();
      router.refresh();
      setDialogOpen(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please check your input!",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex justify-center"
        >
          {/* <Image src="/edit.png" alt="" width={7} height={7} /> */}
          <CiEdit size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Update Tournament</DialogTitle>
          <DialogDescription>What is on your mind?</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6 ">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">
                        Tournament Name
                      </FormLabel>
                      <FormControl className="col-span-3">
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage className="col-span-3 col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Start Date</FormLabel>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          align="start"
                          sideOffset={4}
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              // You might want to handle the popover closing here if needed
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="col-span-3 col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Location</FormLabel>
                      <FormControl className="col-span-3">
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage className="col-span-3 col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minEloRating"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">
                        Minimum Elo Rating
                      </FormLabel>
                      <FormControl className="col-span-3">
                        <Input placeholder={data.maxEloRating} {...field} />
                      </FormControl>
                      <FormMessage className="col-span-3 col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxEloRating"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">
                        Maximum Elo Rating
                      </FormLabel>
                      <FormControl className="col-span-3">
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage className="col-span-3 col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Description</FormLabel>
                      <FormControl className="col-span-3">
                        <Textarea
                          placeholder="What is on your mind?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-3 col-start-2" />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="sm:justify-start">
                {/* <DialogClose asChild> */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="hover:bg-lamaSky hover:text-gray-600 mt-5"
                >
                  {loading ? "Updating Tournament..." : "Update Tournament"}
                </Button>
                {/* </DialogClose> */}
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentUpdateForm;
