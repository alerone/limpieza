import type { HistoryItem } from "../hooks/useHistory";

export function UserHistory({ history }: { history: HistoryItem[] }) {
    return (
        <div className="bg-slate-50 p-4 xl:p-8 flex flex-col text-gray-800 rounded-xl  max-h-[36rem] xl:max-h-[24rem] xl:m-auto">
            <h2 className="exo2-font text-center  xl:text-5xl text-2xl font-semibold">Estadísticas de limpieza</h2>
            {history && history.length > 0 &&
                <>
                    <h2 className="xl:text-2xl text-1xl mt-12 lato-font font-normal">Semanas sin limpiar: <span id="week-count">{history.length}</span></h2>
                    <div className="mt-6 overflow-y-auto bg-amber-200 p-3 xl:p-2 rounded-xl items-center justify-center shadow-md flex flex-col">
                        {history.map((item: HistoryItem) => (
                            <div key={item.week} className="flex gap-4 bg-rose-300 text-gray-800 rounded-xl px-4 py-1">
                                <span className="font-bold text-md xl:text-xl">{item.week}</span>
                                <span key={item.week} className="font-semibold text-md xl:text-xl border-l-2 pl-2  border-gray-800">{item.task}</span>
                            </div>
                        ))}
                    </div>
                </>
            }
            {history && history.length === 0 && (
                <h2 className="text-emerald-400 font-bold text-md xl:text-xl text-center mt-4">Todo limpio por aquí!</h2>
            )}
        </div>
    )
}
