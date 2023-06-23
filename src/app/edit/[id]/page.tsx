"use client";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";

type UpdateBlogParams = {
  title: string;
  description: string;
  id: string;
};

const updateBlog = async (data: UpdateBlogParams) => {
  const res = fetch(`http://localhost:3000/api/blog/${data.id}`, {
    method: "PUT",
    body: JSON.stringify({ title: data.title, description: data.description }),
    //@ts-ignore
    "Content-Type": "application/json",
  });
  return (await res).json();
};

const deleteBlog = async (id: string) => {
  const res = fetch(`http://localhost:3000/api/blog/${id}`, {
    method: "DELETE",
    //@ts-ignore
    "Content-Type": "application/json",
  });
  return (await res).json();
};

const getBlogById = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`);
  const data = await res.json();
  return data.post;
};

const EditBlog = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    toast.loading("Buscando os detalhes do blog!", { id: "1" });
    getBlogById(params.id)
      .then((data) => {
        if (titleRef.current && descriptionRef.current) {
          titleRef.current.value = data.title;
          descriptionRef.current.value = data.description;
          toast.success("Busca completa!", { id: "1" });
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error("Erro ao buscar blog!", { id: "1" });
      });
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (titleRef.current && descriptionRef.current) {
      toast.loading("Carregando...", { id: "1" });
      await updateBlog({
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        id: params.id,
      });
      toast.success("Blog postado com sucesso!", { id: "1" });
      router.push("/");
    }
  };

  const handleDelete = async () => {
    toast.loading("Deletando blog!", { id: "2" });
    await deleteBlog(params.id);
    toast.success("Blog deletado com sucesso!", { id: "2" });
    router.push("/");
  };

  return (
    <Fragment>
      <Toaster />
      <div className="w-full m-auto flex my-4">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl text-slate-200 font-bold p-3">
            Atualize uma Postagem!
          </p>
          <form onSubmit={handleSubmit}>
            <input
              ref={titleRef}
              placeholder="titulo..."
              type="text"
              className="rounded-md px-4 py-2 my-2 w-full"
            />
            <textarea
              ref={descriptionRef}
              placeholder="descrição..."
              className="rounded-md px-4 py-2 w-full my-2"
            ></textarea>
            <div className="flex justify-between">
              <button className="my-2 font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
                Atualizar
              </button>
            </div>
          </form>
          <button
            onClick={handleDelete}
            className="mt-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-red-500"
          >
            Deletar
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default EditBlog;
