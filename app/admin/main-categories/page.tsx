"use client";
import { useMainCategories } from "./hooks/useMainCategories";
import CategoriesTable from "./components/CategoriesTable";
import AddModal from "./components/AddModal";
import EditModal from "./components/EditModal";
import DeleteModal from "./components/DeleteModal";

export default function MainCategoriesPage() {
  const {
    categories, filtered, search, setSearch,
    showModal, setShowModal, name, setName, error, loading, handleAdd,
    editCat, setEditCat, editName, setEditName, editError, editLoading, handleEdit,
    confirmDelete, setConfirmDelete, confirmDeleteAction,
  } = useMainCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">التصنيفات الرئيسية</h1>
        <button
          onClick={() => { setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          + إضافة تصنيف
        </button>
      </div>

      <CategoriesTable
        categories={categories}
        filtered={filtered}
        search={search}
        onSearchChange={setSearch}
        onEdit={(cat) => { setEditCat(cat); setEditName(cat.name); }}
        onDelete={setConfirmDelete}
      />

      {showModal && (
        <AddModal
          name={name}
          error={error}
          loading={loading}
          onNameChange={setName}
          onSubmit={handleAdd}
          onClose={() => { setShowModal(false); setName(""); }}
        />
      )}

      {editCat && (
        <EditModal
          editCat={editCat}
          editName={editName}
          editError={editError}
          editLoading={editLoading}
          onNameChange={setEditName}
          onSubmit={handleEdit}
          onClose={() => setEditCat(null)}
        />
      )}

      {confirmDelete && (
        <DeleteModal
          name={confirmDelete}
          onConfirm={confirmDeleteAction}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
